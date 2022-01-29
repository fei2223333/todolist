const express = require('express');

const app = express.Router();
const repository = require('../respositories/TodoRepository');

app.get('/', (req, res) => {
  console.log('connected')
  repository.findAll().then((todos) => {
    res.json(todos);
  }).catch((error) => console.log(error));
});

app.post('/', (req, res) => {
  const { content } = req.body;
  console.log(content)
  repository.create(content).then((todo) => {
    res.json(todo);
  }).catch((error) => console.log(error));
});

app.delete('/:id', (req, res) => {
  const { id } = req.params;
  repository.deleteById(id).then((ok) => {
    res.status(200).json([]);
  }).catch((error) => console.log(error));
});

app.put('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id)
  repository.updateById(id, req.body.list.content, req.body.list.status)
    .then(res.status(200).json([]))
    .catch((error) => console.log(error));
});
module.exports = app;
