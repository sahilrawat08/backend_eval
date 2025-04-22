const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
    try {
        const { search, category, priority, completed } = req.query;
        let query = { userId: req.session.userId };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (priority) {
            query.priority = priority;
        }
        if (completed !== undefined) {
            query.completed = completed === 'true';
        }

        const todos = await Todo.find(query).sort({ 
            priority: -1, 
            dueDate: 1,
            createdAt: -1 
        });

        // Get unique categories for filter dropdown
        const categories = await Todo.distinct('category', { userId: req.session.userId });
        const priorities = ['low', 'medium', 'high'];

        res.render('index', { 
            todos,
            categories,
            priorities,
            filters: req.query,
            username: req.session.username
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
};

exports.createTodo = async (req, res) => {
    try {
        const { title, dueDate, priority, category, tags } = req.body;
        if (!title) {
            return res.redirect('/');
        }

        const todoData = {
            title,
            dueDate: dueDate || null,
            priority: priority || 'medium',
            category: category || null,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            userId: req.session.userId
        };

        await Todo.create(todoData);
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
};

exports.toggleTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({ 
            _id: req.params.id,
            userId: req.session.userId
        });
        
        if (!todo) {
            return res.redirect('/');
        }
        
        todo.completed = !todo.completed;
        await todo.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        await Todo.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId
        });
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
};