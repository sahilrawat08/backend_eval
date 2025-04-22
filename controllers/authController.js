const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
    res.render('login', { 
        errorMessage: null,
        successMessage: req.session.successMessage
    });
    req.session.successMessage = null;
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { 
                errorMessage: 'Invalid username or password',
                successMessage: null
            });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { 
                errorMessage: 'Invalid username or password',
                successMessage: null
            });
        }
        
        // Set session
        req.session.isAuthenticated = true;
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
};

exports.getRegister = (req, res) => {
    res.render('register', { errorMessage: null });
};

exports.postRegister = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validate form
        if (password !== confirmPassword) {
            return res.render('register', { 
                errorMessage: 'Passwords do not match'
            });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }]
        });
        
        if (existingUser) {
            return res.render('register', { 
                errorMessage: 'Username or email already exists'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        req.session.successMessage = 'Registration successful! Please log in.';
        res.redirect('/login');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
};

exports.postLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
};