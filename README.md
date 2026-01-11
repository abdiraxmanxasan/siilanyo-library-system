<div align="center">

# 📚 Silaanyo Library Management System

### A Complete Full-Stack Library Management Solution

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**[Live Demo](#) |  [Documentation](#) | [Report Bug](https://github.com) | [Request Feature](https://github.com)**

</div>

---

## ✨ Features

<table>
<tr>
<td>

### 🎯 Core Features
- 📊 **Real-time Dashboard** with statistics
- 📖 **Book Management** (Add, Edit, Delete)
- 🔍 **Advanced Search** by title, author, ISBN
- 🏷️ **Categories & Authors** management
- 👥 **Members Management**
- 🔄 **Borrowing System** with overdue tracking
- 📄 **PDF Export** for inventory reports

</td>
<td>

### 🔐 Security & Access
- 🔑 **Admin Authentication System**
- 👁️ **Public View-Only Interface**
- 🛡️ **Protected Admin Routes**
- 🚪 **Secure Login/Logout**

### 📚 Pre-loaded Content
- **60+ Sample Books** across 7 categories
- **16 Authors** (Somali & International)
- **Ready-to-use** library system

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 14.0.0
npm >= 6.0.0
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/siilan yo-library.git
   cd siilanyo-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   Public View: http://localhost:3000/index.html
   Admin Login: http://localhost:3000/login.html
   ```

---

## 🎮 Usage

### For Public Users (View Only)
- Browse the complete book catalog
- Search and filter books
- View categories and authors
- Export catalog to PDF

### For Administrators
**Login Credentials:**
- **Username:** `Eng-Apthirahman`
- **Password:** `dhagburo1234`

**Admin Capabilities:**
- Full CRUD operations on books
- Manage categories and authors
- Add and manage library members
- Handle book borrowing and returns
- View detailed statistics

---

## 📸 Screenshots

### Public View
*Beautiful, read-only interface for browsing the library*

### Admin Dashboard
*Complete management system with statistics and controls*

### Login Page
*Secure authentication for administrators*

---

## 🏗️ Project Structure

```
siilanyo-library/
├── server.js           # Express server & API routes
├── database.js         # SQLite database setup & queries
├── package.json        # Dependencies
├── login.html          # Admin login page
├── index.html          # Public view-only interface
├── admin.html          # Admin control panel
├── css/
│   └── style.css      # Complete styling system
├── js/
│   ├── app.js         # Admin application logic
│   └── public.js      # Public view logic
└── library.db         # SQLite database (auto-generated)
```

---

## 🔌 API Endpoints

### Books
```http
GET    /api/books          # Get all books
POST   /api/books          # Add new book (Admin only)
PUT    /api/books/:id      # Update book (Admin only)
DELETE /api/books/:id      # Delete book (Admin only)
```

### Categories
```http
GET    /api/categories     # Get all categories
POST   /api/categories     # Add category (Admin only)
PUT    /api/categories/:id # Update category (Admin only)
DELETE /api/categories/:id # Delete category (Admin only)
```

### Authentication
```http
POST   /api/login          # Admin login
```

[View complete API documentation →](#)

---

## 📚 Sample Books Collection

The library comes pre-loaded with **60+ carefully curated books**:

- **Fiction** (15 books) - Nuruddin Farah, Nadifa Mohamed, Shakespeare
- **Science** (12 books) - Stephen Hawking, Neil deGrasse Tyson
- **History** (10 books) - Yuval Noah Harari, Somali History
- **Technology** (8 books) - Programming, AI, Web Development
- **Biography** (5 books) - Malcolm X, African Leaders
- **Religion** (5 books) - Islamic Studies
- **Business** (5 books) - Napoleon Hill, Robert Kiyosaki

---

## 🛠️ Built With

- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **PDF Export:** jsPDF
- **Authentication:** Session-based

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Eng-Apthirahman**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🌟 Show your support

Give a ⭐️ if this project helped you!

---

<div align="center">

**Made with ❤️ for the Somali community**

[Report Bug](https://github.com/issues) · [Request Feature](https://github.com/issues) · [Documentation](#)

</div>
