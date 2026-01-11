const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Admin credentials (in production, use proper hashing and database)
const ADMIN_USERNAME = 'Eng-Apthirahman';
const ADMIN_PASSWORD = 'dhagburo1234';

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({
            success: true,
            message: 'Login successful',
            user: username
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

// =====================
// CATEGORIES ROUTES
// =====================

// Get all categories
app.get('/api/categories', (req, res) => {
    db.getAllCategories((err, categories) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(categories);
    });
});

// Add category
app.post('/api/categories', (req, res) => {
    const { name } = req.body;
    db.addCategory(name, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name });
    });
});

// Update category
app.put('/api/categories/:id', (req, res) => {
    const { name } = req.body;
    db.updateCategory(req.params.id, name, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Category updated', changes: this.changes });
    });
});

// Delete category
app.delete('/api/categories/:id', (req, res) => {
    db.deleteCategory(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Category deleted', changes: this.changes });
    });
});

// =====================
// AUTHORS ROUTES
// =====================

// Get all authors
app.get('/api/authors', (req, res) => {
    db.getAllAuthors((err, authors) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(authors);
    });
});

// Add author
app.post('/api/authors', (req, res) => {
    const { name } = req.body;
    db.addAuthor(name, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name });
    });
});

// Update author
app.put('/api/authors/:id', (req, res) => {
    const { name } = req.body;
    db.updateAuthor(req.params.id, name, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Author updated', changes: this.changes });
    });
});

// Delete author
app.delete('/api/authors/:id', (req, res) => {
    db.deleteAuthor(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Author deleted', changes: this.changes });
    });
});

// =====================
// BOOKS ROUTES
// =====================

// Get all books
app.get('/api/books', (req, res) => {
    db.getAllBooks((err, books) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Transform to match frontend format
        const transformedBooks = books.map(book => ({
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            authorId: book.author_id,
            authorName: book.author_name,
            categoryId: book.category_id,
            categoryName: book.category_name,
            copies: book.copies,
            availableCopies: book.available_copies,
            year: book.year,
            description: book.description
        }));
        res.json(transformedBooks);
    });
});

// Get book by ID
app.get('/api/books/:id', (req, res) => {
    db.getBookById(req.params.id, (err, book) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    });
});

// Add book
app.post('/api/books', (req, res) => {
    const book = req.body;
    db.addBook(book, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, ...book });
    });
});

// Update book
app.put('/api/books/:id', (req, res) => {
    const book = req.body;
    db.updateBook(req.params.id, book, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Book updated', changes: this.changes });
    });
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
    db.deleteBook(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Book deleted', changes: this.changes });
    });
});

// =====================
// MEMBERS ROUTES
// =====================

// Get all members
app.get('/api/members', (req, res) => {
    db.getAllMembers((err, members) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(members);
    });
});

// Add member
app.post('/api/members', (req, res) => {
    const member = req.body;
    db.addMember(member, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, ...member });
    });
});

// Update member
app.put('/api/members/:id', (req, res) => {
    const member = req.body;
    db.updateMember(req.params.id, member, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Member updated', changes: this.changes });
    });
});

// Delete member
app.delete('/api/members/:id', (req, res) => {
    db.deleteMember(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Member deleted', changes: this.changes });
    });
});

// =====================
// BORROWS ROUTES
// =====================

// Get all borrows
app.get('/api/borrows', (req, res) => {
    db.getAllBorrows((err, borrows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Transform to match frontend format
        const transformedBorrows = borrows.map(borrow => ({
            id: borrow.id,
            memberId: borrow.member_id,
            memberName: borrow.member_name,
            bookId: borrow.book_id,
            bookTitle: borrow.book_title,
            borrowDate: borrow.borrow_date,
            returnDate: borrow.return_date,
            returnedDate: borrow.returned_date,
            status: borrow.status
        }));
        res.json(transformedBorrows);
    });
});

// Add borrow
app.post('/api/borrows', (req, res) => {
    const borrow = req.body;
    db.addBorrow(borrow, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, ...borrow, status: 'active' });
    });
});

// Return book
app.put('/api/borrows/:id/return', (req, res) => {
    db.returnBook(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Book returned successfully', changes: this.changes });
    });
});

// =====================
// STATISTICS
// =====================

// Get statistics
app.get('/api/stats', (req, res) => {
    const stats = {};

    db.getAllBooks((err, books) => {
        if (err) return res.status(500).json({ error: err.message });

        stats.totalBooks = books.reduce((sum, book) => sum + book.copies, 0);
        stats.availableBooks = books.reduce((sum, book) => sum + book.available_copies, 0);

        db.getAllMembers((err, members) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.totalMembers = members.length;

            db.getAllBorrows((err, borrows) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.borrowedBooks = borrows.filter(b => b.status === 'active').length;
                res.json(stats);
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Silaanyo Library Server Running!`);
    console.log(`========================================`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`📚 Frontend: http://localhost:${PORT}/index.html`);
    console.log(`🔌 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`========================================\n`);
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
