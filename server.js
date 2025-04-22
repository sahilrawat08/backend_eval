const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Todo Schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: { type: String },
    tags: [{ type: String }]
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const { search, category, priority, completed } = req.query;
        let query = {};

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
        const categories = await Todo.distinct('category');
        const priorities = ['low', 'medium', 'high'];

        res.render('index', { 
            todos,
            categories,
            priorities,
            filters: req.query
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

app.post('/todos', async (req, res) => {
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
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        };

        await Todo.create(todoData);
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

app.post('/todos/:id/toggle', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
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
});

app.post('/todos/:id/delete', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 