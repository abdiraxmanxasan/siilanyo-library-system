<div align="center">

# 📚 Silaanyo Library Management System

### A Complete Full-Stack Library Management Solution

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**[Repository](https://github.com/abdiraxmanxasan/siilanyo-library-system) • [Features](#-features) • [Quick Start](#-quick-start) • [API](#-api-endpoints)**

</div>

---

## ✨ Key Features

### 📖 Core Library Management
- **Book Catalog** - Complete CRUD operations for book management
- **Advanced Search** - Search by title, author, ISBN, or category
- **Category Management** - Organize books into logical categories
- **Author Management** - Maintain author database and relationships
- **Real-time Dashboard** - Statistics and library overview at a glance

### 👥 Member & Borrowing System
- **Member Management** - Register, track, and manage library members
- **Borrowing System** - Track borrowed books and due dates
- **Overdue Tracking** - Automatic alerts for overdue returns
- **Return Management** - Easy book return processing
- **Member History** - Complete borrowing history per member

### 📊 Analytics & Reporting
- **Statistical Dashboard** - Real-time library statistics
- **Book Inventory** - Track book availability and stock
- **PDF Reports** - Export inventory and member reports
- **Usage Analytics** - Borrowing trends and popular books
- **Performance Metrics** - Library utilization data

### 🔐 Security & Access Control
- **Admin Authentication** - Secure login system
- **Protected Routes** - Admin-only operations
- **Public View Interface** - Read-only access for guests
- **Session Management** - Secure user sessions
- **Access Control** - Role-based permissions

### 📚 Pre-loaded Content
- **60+ Sample Books** - Diverse collection across 7 categories
- **16 Authors** - Somali and International authors
- **Multiple Categories** - Fiction, Science, History, Technology, Biography, Religion, Business
- **Ready-to-Use System** - Immediate operational capacity

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 14.0.0
npm >= 6.0.0
```

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/abdiraxmanxasan/siilanyo-library-system.git
cd siilanyo-library-system
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Server**
```bash
npm start
```

4. **Access Application**
```
Public View:  http://localhost:3000/index.html
Admin Login:  http://localhost:3000/login.html
Admin Panel:  http://localhost:3000/admin.html
```

---

## 🎮 Usage Guide

### Public Users (Read-Only Access)
✅ Browse complete book catalog
✅ Search and filter books by multiple criteria
✅ View book details and availability
✅ Explore categories and authors
✅ Export catalog to PDF

### Administrators
**Default Login Credentials:**
```
Username: Eng-Apthirahman
Password: dhagburo1234
```

**Admin Capabilities:**
- ✅ Full CRUD on books (Create, Read, Update, Delete)
- ✅ Manage categories and authors
- ✅ Add and manage library members
- ✅ Process book borrowing and returns
- ✅ View detailed statistics and reports
- ✅ Export data to PDF format

---

## 🏗️ Project Structure

```
siilanyo-library-system/
├── server.js               # Express server & API routes
├── database.js             # SQLite setup & query functions
├── package.json            # Node.js dependencies
├── login.html              # Admin authentication page
├── index.html              # Public library interface
├── admin.html              # Admin control panel
├── css/
│   └── style.css           # Complete styling system
├── js/
│   ├── app.js              # Admin application logic
│   └── public.js           # Public view logic
├── library.db              # SQLite database (auto-generated)
└── README.md               # Documentation
```

---

## 🔌 API Endpoints

### Books Management
```http
GET    /api/books                 # Get all books
GET    /api/books/:id             # Get specific book
POST   /api/books                 # Add new book (Admin only)
PUT    /api/books/:id             # Update book (Admin only)
DELETE /api/books/:id             # Delete book (Admin only)
GET    /api/books/search/:query   # Search books
```

### Categories
```http
GET    /api/categories            # Get all categories
POST   /api/categories            # Add category (Admin only)
PUT    /api/categories/:id        # Update category (Admin only)
DELETE /api/categories/:id        # Delete category (Admin only)
```

### Authors
```http
GET    /api/authors               # Get all authors
POST   /api/authors               # Add author (Admin only)
PUT    /api/authors/:id           # Update author (Admin only)
DELETE /api/authors/:id           # Delete author (Admin only)
```

### Members
```http
GET    /api/members               # Get all members (Admin only)
POST   /api/members               # Register new member (Admin only)
PUT    /api/members/:id           # Update member (Admin only)
DELETE /api/members/:id           # Delete member (Admin only)
```

### Borrowing
```http
POST   /api/borrow                # Create borrow record (Admin only)
POST   /api/return                # Process book return (Admin only)
GET    /api/borrowed/:memberId    # Get member's borrowed books
```

### Authentication
```http
POST   /api/login                 # Admin login
POST   /api/logout                # Admin logout
GET    /api/check-auth            # Verify session
```

### Dashboard & Statistics
```http
GET    /api/dashboard             # Get dashboard statistics
GET    /api/stats/borrowed        # Books currently borrowed
GET    /api/stats/overdue         # Overdue books
GET    /api/stats/popular         # Most borrowed books
```

---

## 📚 Sample Book Collection

Pre-loaded library with **60+ carefully curated books**:

| Category | Count | Examples |
|----------|-------|----------|
| **Fiction** | 15 | Nuruddin Farah, Nadifa Mohamed, Shakespeare |
| **Science** | 12 | Stephen Hawking, Neil deGrasse Tyson |
| **History** | 10 | Yuval Noah Harari, Somali History |
| **Technology** | 8 | Programming, AI, Web Development |
| **Biography** | 5 | Malcolm X, African Leaders |
| **Religion** | 5 | Islamic Studies |
| **Business** | 5 | Napoleon Hill, Robert Kiyosaki |

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js 14+ |
| **Backend Framework** | Express.js |
| **Database** | SQLite3 |
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |
| **PDF Generation** | jsPDF |
| **Authentication** | Session-based |

---

## 📖 Database Schema

### Books Table
```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER,
  isbn TEXT UNIQUE,
  category_id INTEGER,
  quantity INTEGER,
  available INTEGER,
  description TEXT,
  created_at TIMESTAMP
)
```

### Members Table
```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  membership_date TIMESTAMP,
  status TEXT
)
```

### Borrowing Table
```sql
CREATE TABLE borrowings (
  id INTEGER PRIMARY KEY,
  member_id INTEGER,
  book_id INTEGER,
  borrow_date TIMESTAMP,
  due_date TIMESTAMP,
  return_date TIMESTAMP,
  status TEXT
)
```

---

## 🤝 Contributing

Contributions are welcome! Process:

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** changes: `git commit -m 'Add AmazingFeature'`
4. **Push** to branch: `git push origin feature/AmazingFeature`
5. **Submit** Pull Request

---

## 📝 License

Licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🐛 Troubleshooting

### Common Issues

**Port 3000 Already in Use**
```bash
# Use different port
npm start -- --port 3001
```

**Database Errors**
```bash
# Reset database
rm library.db
npm start
```

**Login Issues**
- Verify username: `Eng-Apthirahman`
- Verify password: `dhagburo1234`
- Check browser console for errors

---

## 📞 Support

**Need Help?**
- Check project documentation
- Review API endpoints
- Examine source code in `js/app.js`
- Open an Issue on GitHub
- Review error messages in browser console

---

## 👨‍💻 Developer

**Eng. Apthiraman Hasan**

- GitHub: [@abdiraxmanxasan](https://github.com/abdiraxmanxasan)
- Repository: [siilanyo-library-system](https://github.com/abdiraxmanxasan/siilanyo-library-system)

---

<div align="center">

### 🌟 Show your support

Give a ⭐️ if this project helped you!

**Made with ❤️ for the Somali community**

[⬆ Back to top](#-silaanyo-library-management-system)

</div>
