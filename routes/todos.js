const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, todoController.getTodos);
router.post('/todos', isAuth, todoController.createTodo);
router.post('/todos/:id/toggle', isAuth, todoController.toggleTodo);
router.post('/todos/:id/delete', isAuth, todoController.deleteTodo);

module.exports = router;