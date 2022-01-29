const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define schema for todo items
const todolistSchema = new Schema({
  content: {
    type: String,
  },
  status: {
    type: String,
  },
},{timestamps:true});

const Todolist = mongoose.model('todolist', todolistSchema);

module.exports = Todolist;
