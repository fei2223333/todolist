const Todolist = require('../models/Todo');

class TodolistRepository {
  constructor(model) {
    this.model = model;
  }

  create(content) {
    const newTodoItem = { content, status: null };
    const todolist = new this.model(newTodoItem);
    return todolist.save();
  }

  findAll() {
    return this.model.find().sort({timestamp: -1});
  }

  findById(id) {
    return this.model.findById(id);
  }


  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  updateById(id, content, status) {
    const query = { _id: id };
    return this.model.findOneAndUpdate(query, { $set: { content, status } });
  }
}

module.exports = new TodolistRepository(Todolist);
