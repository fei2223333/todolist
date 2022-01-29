const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')

const routes = require('./routes/Routes');

const app = express();
const dbUrl = 'mongodb+srv://shugeluo:shugeluo123@cluster0.jewdd.mongodb.net/Todolist?retryWrites=true&w=majority';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log('==== connected to db ====')
})

app.use(cors());  //enable cors

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/todos', routes);

app.listen(8080);


module.exports = app;
