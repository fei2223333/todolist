import React from 'react'
import './container.scss';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;



// [
//   {content:"Each item should have an index number", status:null},
//   {content:"The item under the cursor should be highlighted", status:null},
//   {content:"After click an item, it should be flipped to its backside, in which the detailed descriptions (randomly generated) are shown", status:null},
//   {content:"The order of items can be arranged by drag & drop", status:null},
//   {content:"The index number should be maintained during reordering", status:null},
//   {content:"Each item is in one of the following state, indicated with font color", status:null},
//   {content:"Drag an item and drop it to the following state block will change its state", status:null},
//   {content:"Show a count number besides the following blocks", status:null},
//   ]



const description = `
We need a to-do list to track the progress of our tasks and we created a
static version. However, the items cannot be reordered or updated, which 
bothers us a lot.

Could you help refine this to-do list. The detailed action items are 
listed within the list itself. Thank you very much!
`;

const TodoListItem =(props) => {
    
    const getType=(data)=>{
        let res;
        switch(data.status){
            case "finished":
                res = {
                    textDecoration: "line-through",
                    color: "green"
                }
            break;
            case "working":
                res = {
                    color: "red"
                }
            break;
            case "cancelled":
                res = {
                    textDecoration: "line-through",
                    color: "rgb(172,172,172)"
                }
            break;
            default:
                res ={

                }

        }
        return res;
    }
    const deleteTodoListItem=(list)=>{
      fetch(`http://localhost:8080/todos/${list._id}`,{
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then((res)=>{
      if(res.ok){
        return res.json();
      }else{
        throw new Error()
      }
    }).
    then(()=>{
        props.fetchTodoList();
    })
    .catch((e)=>{

    })
    }

	return (
		props.list.map( (i, j)=>(
        			<div className='item'
				draggable
				key={j}
				id={j}
				onDrop={props.handleDrop}
				onDragStart={props.handleStartDrag}
				onDragOver={(event) => event.preventDefault()}
                style={getType(i)}
				>
					{j+1}. {i.content}<Button onClick={()=>deleteTodoListItem(i)} style={{display:'inline-block'}}>-</Button>
			</div>
		))
	)
}


class Container extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			list: [],
              finishedCount:0,
              workingCount:0,
              prepareCount:0,
              cancelCount:0,
		}
		this.item = null;
		this.lastY = null;
	}

	handleDrop = (event) => {
		// console.log('drop'+event.dataTransfer.getData("target"),event.target.id);
		let a = parseInt(event.target.id), b = parseInt(event.dataTransfer.getData("target"));
		if (a===b) return;

		let max = this.state.list.length;
		let newList = [], n=0;
		while (n<max) {
			if (n!==b) {
				if (n===a) {
					if (b<a) {
						newList.push(this.state.list[n]);
						newList.push(this.state.list[b]);
					} else {
						newList.push(this.state.list[b]);
						newList.push(this.state.list[n]);
					}
				} else {
					newList.push(this.state.list[n]);
				}
			}
			n++;
		}
		this.setState({list: newList});
	}

	handleStartDrag = (e) => {
		this.item = e.target;
		this.lastY = e.clientY;
		e.dataTransfer.setData("target", e.target.id);
	}


	actionDropHandler=(e, action)=>{
        let id = e.dataTransfer.getData("target");
        let data = this.state.list[id];
        

        if(data.status){
            switch(data.status){
                case "finished":
                    this.setState({
                        finishedCount:this.state.finishedCount-1,
                    })
                break;
                case "working":
                    this.setState({
                        workingCount:this.state.workingCount-1,
                    })
                break;
                case "preparing":
                    this.setState({
                        prepareCount:this.state.prepareCount-1,
                    })
                break;
                case "cancelled":
                    this.setState({
                        cancelCount:this.state.cancelCount-1,
                    })
                break;
            }
        }

        switch(action){
            case "onFinished":
                this.setState({
                    finishedCount:this.state.finishedCount+1,
                    list:this.state.list.map((l, i)=>{
                        if(i == id){
                            return {
                                ...l,
                                status: "finished"
                            }
                        }
                        return l;
                    })
                })
                
                break;
            case "onWorking":
                this.setState({
                    workingCount:this.state.workingCount+1,
                    list:this.state.list.map((l, i)=>{
                        if(i == id){
                            return {
                              ...l,
                                status: "working"
                            }
                        }
                        return l;
                    })
                })
                break;
            case "onPreparing":
                this.setState({
                    prepareCount:this.state.prepareCount+1,
                    list:this.state.list.map((l, i)=>{
                        if(i == id){
                            return {
                              ...l,
                                status: "preparing"
                            }
                        }
                        return l;
                    })
                })
                break;
            case "onCancel":
                this.setState({
                    cancelCount:this.state.cancelCount+1,
                    list:this.state.list.map((l, i)=>{
                        if(i == id){
                            return {
                              ...l,
                                status: "cancelled"
                            }
                        }
                        return l;
                    })
                })
                break;
        }
        
	}

  componentDidMount=()=>{
    this.fetchTodoList()
  }

  componentDidUpdate=(prevProps, prevState)=>{
    if(prevState.list.length === 0) return;
    if(this.state.list !== prevState.list){
      this.state.list.forEach((l,i)=>{
        const prevList = prevState.list.find((pl)=>pl._id === l._id);
        if(prevList && !(!l.status && !prevList.status)){
          if(l.status !== prevList.status || l.content !== prevList.content){
            this.updateTodoList(l);
          }
        } 
      })
    }

    // to do
    // const finishedCount = 0;
    // const workingCount=0;
    // const prepareCount=0;
    // const cancelCount0=0;
    // this.st
    // this.setState
  }

  updateTodoList=(list)=>{
    fetch(`http://localhost:8080/todos/${list._id}`,{
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:JSON.stringify({list})
    }).then((res)=>{
      if(res.ok){
        return res.json();
      }else{
        throw new Error()
      }
    }).then(()=>{
      this.fetchTodoList();
    })
  }

  fetchTodoList=()=>{
    fetch('http://localhost:8080/todos',{
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then((res)=>{
      if(res.ok){
        return res.json();
      }else{
        throw new Error()
      }
    }).then((todoitems)=>{
      console.log(todoitems);
      this.setState({
        list:todoitems
      })
    })
  }

  onTodoChange=(values)=>{
    fetch('http://localhost:8080/todos',{
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:JSON.stringify({content:values.content}),
    }).then((res)=>{
      console.log(res)
      if(res.ok){
        return res.json();
      }else{
        throw new Error()
      }
    }).then(()=>{
      this.fetchTodoList();

    })
  }

	render() {
		return ( <div>
            <div className="description">
                  <div>{description}</div>
                </div>
                


			<div className="collection">
				<div className="item-list" >
					<TodoListItem
						list={this.state.list}
						updateList={this.updateList}
						handleDrop={this.handleDrop}
						handleStartDrag={this.handleStartDrag}
            setState={this.setState}
            fetchTodoList={this.fetchTodoList}
					/>
				</div>
        <div className="drop-action-zone" onDragOver={(event) => event.preventDefault()}>
			<div onDrop={(e)=>{this.actionDropHandler(e, 'onFinished')}}>Fininshed({this.state.finishedCount})</div>
			<div onDrop={(e)=>{this.actionDropHandler(e, 'onWorking')}}>Working({this.state.workingCount})</div>
			<div onDrop={(e)=>{this.actionDropHandler(e, 'onPreparing')}}>Preparing({this.state.prepareCount})</div>
			<div onDrop={(e)=>{this.actionDropHandler(e, 'onCancel')}}>Cancelled({this.state.cancelCount})</div>
			</div>
			</div>
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={this.onTodoChange}
    >
      <Form.Item
        label="content"
        name="content"
        
      >
              <TextArea showCount maxLength={100}  />
              
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Form>

            <div className="preview">
                  <div className="preview-title">
                    Sample result
                  </div>
                    <img src="https://media.giphy.com/media/24m649DLWjmspI75ZY/giphy.gif" alt="Preview Expected result" />
              </div>
			</div>
		)
	}
}

export default Container
