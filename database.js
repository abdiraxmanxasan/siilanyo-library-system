const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/Connect to database
const dbPath = path.join(__dirname, 'library.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Categories table
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`);

        // Authors table
        db.run(`CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )`);

        // Books table
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            isbn TEXT,
            author_id INTEGER,
            category_id INTEGER,
            copies INTEGER DEFAULT 1,
            available_copies INTEGER DEFAULT 1,
            year INTEGER,
            description TEXT,
            FOREIGN KEY (author_id) REFERENCES authors(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )`);

        // Members table
        db.run(`CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            member_since TEXT
        )`);

        // Borrows table
        db.run(`CREATE TABLE IF NOT EXISTS borrows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_id INTEGER,
            book_id INTEGER,
            borrow_date TEXT,
            return_date TEXT,
            returned_date TEXT,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (member_id) REFERENCES members(id),
            FOREIGN KEY (book_id) REFERENCES books(id)
        )`);

        // Insert default categories if empty
        db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
            if (!err && row.count === 0) {
                const categories = ['Fiction', 'Science', 'History', 'Technology', 'Biography', 'Religion', 'Business & Economics'];
                const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
                categories.forEach(cat => stmt.run(cat));
                stmt.finalize();
                console.log('Default categories inserted');
            }
        });

        // Insert default authors if empty
        db.get('SELECT COUNT(*) as count FROM authors', (err, row) => {
            if (!err && row.count === 0) {
                const authors = [
                    'Hamse Abdi', 'Khalid Mohamed', 'Cumer Khalid', 'Mohamed Hassan',
                    'Nuruddin Farah', 'Nadifa Mohamed', 'William Shakespeare', 'Chinua Achebe',
                    'Stephen Hawking', 'Neil deGrasse Tyson', 'Yuval Noah Harari', 'Malcolm X',
                    'Napoleon Hill', 'Robert Kiyosaki', 'Dale Carnegie', 'Imam Al-Ghazali'
                ];
                const stmt = db.prepare('INSERT INTO authors (name) VALUES (?)');
                authors.forEach(author => stmt.run(author));
                stmt.finalize();
                console.log('Default authors inserted');
            }
        });

        // Insert sample books if empty
        db.get('SELECT COUNT(*) as count FROM books', (err, row) => {
            if (!err && row.count === 0) {
                insertSampleBooks();
            }
        });
    });
}

// Insert 50+ sample books
function insertSampleBooks() {
    const sampleBooks = [
        // Fiction (15 books)
        { title: 'Maps', isbn: '978-1594634024', author: 'Nuruddin Farah', category: 'Fiction', copies: 3, year: 1986, desc: 'A powerful novel about Somalia during political turmoil' },
        { title: 'The Orchard of Lost Souls', isbn: '978-0374229009', author: 'Nadifa Mohamed', category: 'Fiction', copies: 2, year: 2013, desc: 'Set in 1980s Somalia, a story of three women' },
        { title: 'Things Fall Apart', isbn: '978-0385474542', author: 'Chinua Achebe', category: 'Fiction', copies: 4, year: 1958, desc: 'Classic African novel about colonialism' },
        { title: 'Hamlet', isbn: '978-0743477123', author: 'William Shakespeare', category: 'Fiction', copies: 3, year: 1603, desc: 'Timeless tragedy of revenge and madness' },
        { title: 'Romeo and Juliet', isbn: '978-0743477116', author: 'William Shakespeare', category: 'Fiction', copies: 3, year: 1597, desc: 'The greatest love story ever told' },
        { title: 'Macbeth', isbn: '978-0743477109', author: 'William Shakespeare', category: 'Fiction', copies: 2, year: 1606, desc: 'A tale of ambition and power' },
        { title: 'Links', isbn: '978-1594488948', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 2003, desc: 'Story of a man returning to Somalia' },
        { title: 'Knots', isbn: '978-1594484438', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 2007, desc: 'Complex narrative about family and betrayal' },
        { title: 'Crossbones', isbn: '978-1594485565', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 2011, desc: 'Novel about Somalia and piracy' },
        { title: 'Black Mamba Boy', isbn: '978-0062197658', author: 'Nadifa Mohamed', category: 'Fiction', copies: 2, year: 2010, desc: 'A boys journey across Africa' },
        { title: 'Secrets', isbn: '978-1559702379', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 1998, desc: 'Political novel set in Mogadishu' },
        { title: 'Gifts', isbn: '978-1559705400', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 1999, desc: 'Story of exile and return' },
        { title: 'Sweet and Sour Milk', isbn: '978-1555973353', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 1979, desc: 'Dystopian novel about dictatorship' },
        { title: 'Sardines', isbn: '978-1555973346', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 1981, desc: 'Novel about women under oppression' },
        { title: 'Close Sesame', isbn: '978-1555973339', author: 'Nuruddin Farah', category: 'Fiction', copies: 2, year: 1983, desc: 'Story of an old revolutionary' },

        // Science (12 books)
        { title: 'A Brief History of Time', isbn: '978-0553380163', author: 'Stephen Hawking', category: 'Science', copies: 5, year: 1988, desc: 'Cosmology explained for general readers' },
        { title: 'Astrophysics for People in a Hurry', isbn: '978-0393609394', author: 'Neil deGrasse Tyson', category: 'Science', copies: 4, year: 2017, desc: 'Quick guide to the universe' },
        { title: 'The Grand Design', isbn: '978-0553805376', author: 'Stephen Hawking', category: 'Science', copies: 3, year: 2010, desc: 'Physics and the origin of universe' },
        { title: 'Cosmos', isbn: '978-0345539434', author: 'Neil deGrasse Tyson', category: 'Science', copies: 4, year: 2014, desc: 'Journey through space and time' },
        { title: 'The Universe in a Nutshell', isbn: '978-0553802023', author: 'Stephen Hawking', category: 'Science', copies: 3, year: 2001, desc: 'Latest thoughts on physics' },
        { title: 'Black Holes and Baby Universes', isbn: '978-0553374117', author: 'Stephen Hawking', category: 'Science', copies: 2, year: 1993, desc: 'Essays on black holes' },
        { title: 'Origins: Fourteen Billion Years', isbn: '978-0393327588', author: 'Neil deGrasse Tyson', category: 'Science', copies: 3, year: 2004, desc: 'Story of cosmic evolution' },
        { title: 'Death by Black Hole', isbn: '978-0393330168', author: 'Neil deGrasse Tyson', category: 'Science', copies: 3, year: 2007, desc: 'Cosmic quandaries explained' },
        { title: 'Introduction to Physics', isbn: '978-1234567890', author: 'Hamse Abdi', category: 'Science', copies: 5, year: 2020, desc: 'Fundamentals of physics' },
        { title: 'Chemistry Basics', isbn: '978-2345678901', author: 'Khalid Mohamed', category: 'Science', copies: 4, year: 2019, desc: 'Introduction to chemistry' },
        { title: 'Biology Essentials', isbn: '978-3456789012', author: 'Cumer Khalid', category: 'Science', copies: 4, year: 2021, desc: 'Core concepts in biology' },
        { title: 'Mathematics for Everyone', isbn: '978-4567890123', author: 'Mohamed Hassan', category: 'Science', copies: 5, year: 2022, desc: 'Math made simple' },

        // History (10 books)
        { title: 'Sapiens', isbn: '978-0062316110', author: 'Yuval Noah Harari', category: 'History', copies: 6, year: 2015, desc: 'History of humankind' },
        { title: 'Homo Deus', isbn: '978-0062464316', author: 'Yuval Noah Harari', category: 'History', copies: 4, year: 2017, desc: 'Future of humanity' },
        { title: '21 Lessons for the 21st Century', isbn: '978-0525512172', author: 'Yuval Noah Harari', category: 'History', copies: 5, year: 2018, desc: 'Urgent questions for today' },
        { title: 'History of Somalia', isbn: '978-5678901234', author: 'Hamse Abdi', category: 'History', copies: 4, year: 2018, desc: 'Comprehensive Somali history' },
        { title: 'Ancient Somali Kingdoms', isbn: '978-6789012345', author: 'Cumer Khalid', category: 'History', copies: 3, year: 2019, desc: 'Pre-colonial Somalia' },
        { title: 'African Civilizations', isbn: '978-7890123456', author: 'Khalid Mohamed', category: 'History', copies: 4, year: 2020, desc: 'Great African empires' },
        { title: 'The Somali Peninsula', isbn: '978-8901234567', author: 'Mohamed Hassan', category: 'History', copies: 3, year: 2021, desc: 'Geography and history' },
        { title: 'Horn of Africa Heritage', isbn: '978-9012345678', author: 'Hamse Abdi', category: 'History', copies: 3, year: 2017, desc: 'Regional history' },
        { title: 'Colonial Impact on Somalia', isbn: '978-0123456789', author: 'Nuruddin Farah', category: 'History', copies: 2, year: 2016, desc: 'Analysis of colonialism' },
        { title: 'Modern Somali State', isbn: '978-1234567891', author: 'Nadifa Mohamed', category: 'History', copies: 3, year: 2022, desc: 'Contemporary history' },

        // Technology (8 books)
        { title: 'Introduction to Programming', isbn: '978-2345678902', author: 'Mohamed Hassan', category: 'Technology', copies: 5, year: 2023, desc: 'Learn to code' },
        { title: 'Web Development Guide', isbn: '978-3456789013', author: 'Khalid Mohamed', category: 'Technology', copies: 4, year: 2023, desc: 'Build websites' },
        { title: 'Artificial Intelligence Basics', isbn: '978-4567890124', author: 'Hamse Abdi', category: 'Technology', copies: 4, year: 2023, desc: 'Introduction to AI' },
        { title: 'Database Systems', isbn: '978-5678901235', author: 'Cumer Khalid', category: 'Technology', copies: 3, year: 2022, desc: 'Database management' },
        { title: 'Cybersecurity Fundamentals', isbn: '978-6789012346', author: 'Mohamed Hassan', category: 'Technology', copies: 4, year: 2023, desc: 'Stay safe online' },
        { title: 'Mobile App Development', isbn: '978-7890123457', author: 'Khalid Mohamed', category: 'Technology', copies: 3, year: 2023, desc: 'Build mobile apps' },
        { title: 'Cloud Computing', isbn: '978-8901234568', author: 'Hamse Abdi', category: 'Technology', copies: 3, year: 2022, desc: 'Cloud technologies' },
        { title: 'Data Science Essentials', isbn: '978-9012345679', author: 'Cumer Khalid', category: 'Technology', copies: 4, year: 2023, desc: 'Work with data' },

        // Biography (5 books)
        { title: 'The Autobiography of Malcolm X', isbn: '978-0345350688', author: 'Malcolm X', category: 'Biography', copies: 3, year: 1965, desc: 'Life of Malcolm X' },
        { title: 'Long Walk to Freedom', isbn: '978-0316548182', author: 'Malcolm X', category: 'Biography', copies: 3, year: 1994, desc: 'Inspiring autobiography' },
        { title: 'Life of Prophet Muhammad', isbn: '978-0123456790', author: 'Imam Al-Ghazali', category: 'Biography', copies: 5, year: 2015, desc: 'Biography of the Prophet' },
        { title: 'Great African Leaders', isbn: '978-1234567892', author: 'Hamse Abdi', category: 'Biography', copies: 2, year: 2019, desc: 'African leadership' },
        { title: 'Somali Heroes', isbn: '978-2345678903', author: 'Khalid Mohamed', category: 'Biography', copies: 3, year: 2020, desc: 'Somali historical figures' },

        // Religion (5 books)
        { title: 'The Revival of Religious Sciences', isbn: '978-0946621446', author: 'Imam Al-Ghazali', category: 'Religion', copies: 4, year: 1995, desc: 'Islamic spirituality' },
        { title: 'The Alchemy of Happiness', isbn: '978-1453759066', author: 'Imam Al-Ghazali', category: 'Religion', copies: 3, year: 2010, desc: 'Path to happiness in Islam' },
        { title: 'Understanding Islam', isbn: '978-3456789014', author: 'Imam Al-Ghazali', category: 'Religion', copies: 5, year: 2018, desc: 'Introduction to Islamic faith' },
        { title: 'Islamic History', isbn: '978-4567890125', author: 'Hamse Abdi', category: 'Religion', copies: 3, year: 2019, desc: 'History of Islam' },
        { title: 'Quran and Science', isbn: '978-5678901236', author: 'Mohamed Hassan', category: 'Religion', copies: 4, year: 2020, desc: 'Islamic perspective on science' },

        // Business & Economics (5 books)
        { title: 'Think and Grow Rich', isbn: '978-1585424337', author: 'Napoleon Hill', category: 'Business & Economics', copies: 5, year: 1937, desc: 'Philosophy of success' },
        { title: 'Rich Dad Poor Dad', isbn: '978-1612680194', author: 'Robert Kiyosaki', category: 'Business & Economics', copies: 6, year: 1997, desc: 'Financial education' },
        { title: 'How to Win Friends', isbn: '978-0671027032', author: 'Dale Carnegie', category: 'Business & Economics', copies: 4, year: 1936, desc: 'Influence people positively' },
        { title: 'Entrepreneurship Guide', isbn: '978-6789012347', author: 'Khalid Mohamed', category: 'Business & Economics', copies: 3, year: 2021, desc: 'Start your business' },
        { title: 'Economic Principles', isbn: '978-7890123458', author: 'Hamse Abdi', category: 'Business & Economics', copies: 3, year: 2022, desc: 'Understanding economics' }
    ];

    const stmt = db.prepare(`
        INSERT INTO books (title, isbn, author_id, category_id, copies, available_copies, year, description)
        SELECT ?, ?, 
            (SELECT id FROM authors WHERE name = ?),
            (SELECT id FROM categories WHERE name = ?),
            ?, ?, ?, ?
    `);

    sampleBooks.forEach(book => {
        stmt.run(
            book.title,
            book.isbn,
            book.author,
            book.category,
            book.copies,
            book.copies,
            book.year,
            book.desc
        );
    });

    stmt.finalize(() => {
        console.log('Sample books inserted successfully!');
    });
}

// Export database instance and helper functions
module.exports = {
    db,

    // Categories
    getAllCategories: (callback) => {
        db.all('SELECT * FROM categories ORDER BY name', callback);
    },

    addCategory: (name, callback) => {
        db.run('INSERT INTO categories (name) VALUES (?)', [name], callback);
    },

    updateCategory: (id, name, callback) => {
        db.run('UPDATE categories SET name = ? WHERE id = ?', [name, id], callback);
    },

    deleteCategory: (id, callback) => {
        db.run('DELETE FROM categories WHERE id = ?', [id], callback);
    },

    // Authors
    getAllAuthors: (callback) => {
        db.all('SELECT * FROM authors ORDER BY name', callback);
    },

    addAuthor: (name, callback) => {
        db.run('INSERT INTO authors (name) VALUES (?)', [name], callback);
    },

    updateAuthor: (id, name, callback) => {
        db.run('UPDATE authors SET name = ? WHERE id = ?', [name, id], callback);
    },

    deleteAuthor: (id, callback) => {
        db.run('DELETE FROM authors WHERE id = ?', [id], callback);
    },

    // Books
    getAllBooks: (callback) => {
        db.all(`
            SELECT b.*, c.name as category_name, a.name as author_name
            FROM books b
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN authors a ON b.author_id = a.id
            ORDER BY b.id DESC
        `, callback);
    },

    getBookById: (id, callback) => {
        db.get(`
            SELECT b.*, c.name as category_name, a.name as author_name
            FROM books b
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN authors a ON b.author_id = a.id
            WHERE b.id = ?
        `, [id], callback);
    },

    addBook: (book, callback) => {
        db.run(`
            INSERT INTO books (title, isbn, author_id, category_id, copies, available_copies, year, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [book.title, book.isbn, book.authorId, book.categoryId, book.copies, book.copies, book.year, book.description], callback);
    },

    updateBook: (id, book, callback) => {
        db.run(`
            UPDATE books 
            SET title = ?, isbn = ?, author_id = ?, category_id = ?, copies = ?, year = ?, description = ?
            WHERE id = ?
        `, [book.title, book.isbn, book.authorId, book.categoryId, book.copies, book.year, book.description, id], callback);
    },

    deleteBook: (id, callback) => {
        db.run('DELETE FROM books WHERE id = ?', [id], callback);
    },

    // Members
    getAllMembers: (callback) => {
        db.all('SELECT * FROM members ORDER BY id DESC', callback);
    },

    addMember: (member, callback) => {
        db.run(`
            INSERT INTO members (name, email, phone, member_since)
            VALUES (?, ?, ?, ?)
        `, [member.name, member.email, member.phone, member.memberSince], callback);
    },

    updateMember: (id, member, callback) => {
        db.run(`
            UPDATE members 
            SET name = ?, email = ?, phone = ?, member_since = ?
            WHERE id = ?
        `, [member.name, member.email, member.phone, member.memberSince, id], callback);
    },

    deleteMember: (id, callback) => {
        db.run('DELETE FROM members WHERE id = ?', [id], callback);
    },

    // Borrows
    getAllBorrows: (callback) => {
        db.all(`
            SELECT br.*, m.name as member_name, b.title as book_title
            FROM borrows br
            LEFT JOIN members m ON br.member_id = m.id
            LEFT JOIN books b ON br.book_id = b.id
            ORDER BY br.id DESC
        `, callback);
    },

    addBorrow: (borrow, callback) => {
        db.serialize(() => {
            db.run(`
                INSERT INTO borrows (member_id, book_id, borrow_date, return_date, status)
                VALUES (?, ?, ?, ?, 'active')
            `, [borrow.memberId, borrow.bookId, borrow.borrowDate, borrow.returnDate], function (err) {
                if (!err) {
                    // Decrease available copies
                    db.run('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?', [borrow.bookId]);
                }
                callback(err, this);
            });
        });
    },

    returnBook: (id, callback) => {
        db.serialize(() => {
            // Get the borrow record
            db.get('SELECT * FROM borrows WHERE id = ?', [id], (err, borrow) => {
                if (!err && borrow) {
                    const today = new Date().toISOString().split('T')[0];
                    // Update borrow status
                    db.run(`
                        UPDATE borrows 
                        SET status = 'returned', returned_date = ?
                        WHERE id = ?
                    `, [today, id], function (err) {
                        if (!err) {
                            // Increase available copies
                            db.run('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?', [borrow.book_id]);
                        }
                        callback(err, this);
                    });
                } else {
                    callback(err);
                }
            });
        });
    }
};
