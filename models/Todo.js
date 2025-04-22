const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    dueDate: { 
        type: Date 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: { 
        type: String,
        trim: true 
    },
    tags: [{ 
        type: String,
        trim: true 
    }],
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Todo', todoSchema);