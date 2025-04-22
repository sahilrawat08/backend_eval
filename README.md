# Enhanced Todo Application

A feature-rich Todo application built with Node.js, Express, EJS, and MongoDB.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Set due dates for tasks
- Assign priority levels (High, Medium, Low)
- Categorize tasks
- Add tags to tasks
- Search functionality
- Filter tasks by:
  - Category
  - Priority
  - Completion status
  - Due date
- Responsive and modern UI
- Server-side rendering with EJS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start MongoDB (if running locally)
4. Start the application:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - EJS templating engine

## Project Structure

```
todo-app/
│
├── server.js              # Main server file
├── package.json           # Project dependencies
├── .gitignore             # Git ignore file
│
├── models/                # Mongoose models
│   ├── Todo.js            # Todo model
│   └── User.js            # User model
│
├── routes/                # Express routes
│   ├── auth.js            # Authentication routes
│   └── todos.js           # Todo CRUD routes
│
├── middleware/            # Express middleware
│   └── isAuth.js          # Authentication middleware
│
├── controllers/           # Route controllers
│   ├── authController.js  # Auth logic
│   └── todoController.js  # Todo CRUD logic
│
├── public/                # Static files
│   ├── css/               # CSS stylesheets
│   │   ├── styles.css     # Main styles
│   │   └── auth.css       # Auth page styles
│   └── js/                # Client-side JavaScript
│       └── main.js        # Main JavaScript file
│
└── views/                 # EJS templates
    ├── partials/          # Reusable template parts
    │   ├── header.ejs     # Header partial
    │   └── footer.ejs     # Footer partial
    ├── index.ejs          # Todo list page
    ├── login.ejs          # Login page
    └── register.ejs       # Registration page