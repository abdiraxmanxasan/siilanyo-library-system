// ==========================================
// SILAANYO LIBRARY MANAGEMENT SYSTEM
// Frontend Application with Backend API
// ==========================================

// API Configuration
const API_URL = 'http://localhost:3000/api';

// ===== HELPER FUNCTIONS =====
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        alert('Error connecting to server. Please make sure the server is running.');
        throw error;
    }
}

// ===== NAVIGATION =====
function navigateTo(page) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const navLink = document.querySelector(`[data-page="${page}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }

    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    const sectionId = page + '-section';
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'books': 'Book Inventory',
        'add-book': 'Add New Book',
        'borrow': 'Borrow Management',
        'categories': 'Categories',
        'authors': 'Authors',
        'members': 'Members'
    };
    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';

    // Refresh data for the page
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'books':
            loadBooks();
            break;
        case 'add-book':
            loadBookForm();
            break;
        case 'borrow':
            loadBorrowPage();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'authors':
            loadAuthors();
            break;
        case 'members':
            loadMembers();
            break;
    }
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        const stats = await apiRequest('/stats');
        const borrows = await apiRequest('/borrows');

        document.getElementById('total-books').textContent = stats.totalBooks || 0;
        document.getElementById('total-members').textContent = stats.totalMembers || 0;
        document.getElementById('borrowed-books').textContent = stats.borrowedBooks || 0;
        document.getElementById('available-books').textContent = stats.availableBooks || 0;

        // Show recent activity
        const recentBorrows = borrows.slice(-5).reverse();
        const activityHtml = recentBorrows.length > 0
            ? recentBorrows.map(borrow => `
                <div style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    <strong>${borrow.memberName || 'Unknown'}</strong> borrowed 
                    <strong>${borrow.bookTitle || 'Unknown'}</strong> on ${borrow.borrowDate}
                </div>
            `).join('')
            : '<div class="empty-state"><div class="empty-state-icon">📭</div><p class="empty-state-text">No recent activity yet</p></div>';

        document.getElementById('recent-activity').innerHTML = activityHtml;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ===== BOOKS =====
async function loadBooks() {
    try {
        const books = await apiRequest('/books');
        const tbody = document.getElementById('books-table-body');

        if (books.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <div class="empty-state-icon">📚</div>
                            <p class="empty-state-text">No books in library yet. Add your first book!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = books.map(book => `
            <tr>
                <td>#${book.id}</td>
                <td>
                    <div class="book-title">${book.title}</div>
                    <div class="book-subtitle">${book.description || 'No description'}</div>
                </td>
                <td>${book.isbn || 'N/A'}</td>
                <td><span class="badge badge-primary">${book.categoryName || 'Unknown'}</span></td>
                <td>${book.authorName || 'Unknown'}</td>
                <td>${book.availableCopies}/${book.copies}</td>
                <td>
                    <button class="btn btn-info btn-sm btn-icon" onclick="editBook(${book.id})" title="Edit">
                        ✏️
                    </button>
                    <button class="btn btn-danger btn-sm btn-icon" onclick="deleteBookConfirm(${book.id})" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Search books
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('book-search');
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.toLowerCase();

            try {
                const books = await apiRequest('/books');
                const filteredBooks = books.filter(book =>
                    book.title.toLowerCase().includes(searchTerm) ||
                    (book.isbn && book.isbn.toLowerCase().includes(searchTerm)) ||
                    (book.authorName && book.authorName.toLowerCase().includes(searchTerm))
                );

                const tbody = document.getElementById('books-table-body');

                if (filteredBooks.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="7">
                                <div class="empty-state">
                                    <div class="empty-state-icon">🔍</div>
                                    <p class="empty-state-text">No books found matching "${searchTerm}"</p>
                                </div>
                            </td>
                        </tr>
                    `;
                    return;
                }

                tbody.innerHTML = filteredBooks.map(book => `
                    <tr>
                        <td>#${book.id}</td>
                        <td>
                            <div class="book-title">${book.title}</div>
                            <div class="book-subtitle">${book.description || 'No description'}</div>
                        </td>
                        <td>${book.isbn || 'N/A'}</td>
                        <td><span class="badge badge-primary">${book.categoryName || 'Unknown'}</span></td>
                        <td>${book.authorName || 'Unknown'}</td>
                        <td>${book.availableCopies}/${book.copies}</td>
                        <td>
                            <button class="btn btn-info btn-sm btn-icon" onclick="editBook(${book.id})" title="Edit">
                                ✏️
                            </button>
                            <button class="btn btn-danger btn-sm btn-icon" onclick="deleteBookConfirm(${book.id})" title="Delete">
                                🗑️
                            </button>
                        </td>
                    </tr>
                `).join('');
            } catch (error) {
                console.error('Error searching books:', error);
            }
        });
    }
});

async function loadBookForm(bookId = null) {
    try {
        const categories = await apiRequest('/categories');
        const authors = await apiRequest('/authors');

        // Populate category dropdown
        const categorySelect = document.getElementById('book-category');
        categorySelect.innerHTML = '<option value="">Select Category</option>' +
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        // Populate author dropdown
        const authorSelect = document.getElementById('book-author');
        authorSelect.innerHTML = '<option value="">Select Author</option>' +
            authors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

        // If editing, load book data
        if (bookId) {
            const book = await apiRequest(`/books/${bookId}`);
            if (book) {
                document.getElementById('book-id').value = book.id;
                document.getElementById('book-title').value = book.title;
                document.getElementById('book-isbn').value = book.isbn || '';
                document.getElementById('book-author').value = book.author_id;
                document.getElementById('book-category').value = book.category_id;
                document.getElementById('book-copies').value = book.copies;
                document.getElementById('book-year').value = book.year || '';
                document.getElementById('book-description').value = book.description || '';
                document.getElementById('book-form-title').textContent = '✏️ Edit Book';
            }
        } else {
            document.getElementById('book-form').reset();
            document.getElementById('book-id').value = '';
            document.getElementById('book-form-title').textContent = '➕ Add New Book';
        }
    } catch (error) {
        console.error('Error loading book form:', error);
    }
}

function editBook(id) {
    navigateTo('add-book');
    setTimeout(() => loadBookForm(id), 100);
}

async function deleteBookConfirm(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            await apiRequest(`/books/${id}`, 'DELETE');
            alert('Book deleted successfully!');
            loadBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
        }
    }
}

// ===== BOOK FORM SUBMISSION =====
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const bookData = {
                title: document.getElementById('book-title').value,
                isbn: document.getElementById('book-isbn').value,
                authorId: parseInt(document.getElementById('book-author').value),
                categoryId: parseInt(document.getElementById('book-category').value),
                copies: parseInt(document.getElementById('book-copies').value),
                year: document.getElementById('book-year').value ? parseInt(document.getElementById('book-year').value) : null,
                description: document.getElementById('book-description').value
            };

            const bookId = document.getElementById('book-id').value;

            try {
                if (bookId) {
                    await apiRequest(`/books/${bookId}`, 'PUT', bookData);
                    alert('Book updated successfully!');
                } else {
                    await apiRequest('/books', 'POST', bookData);
                    alert('Book added successfully!');
                }

                navigateTo('books');
            } catch (error) {
                console.error('Error saving book:', error);
                alert('Failed to save book');
            }
        });
    }
});

// ===== CATEGORIES =====
async function loadCategories() {
    try {
        const categories = await apiRequest('/categories');
        const books = await apiRequest('/books');
        const tbody = document.getElementById('categories-table-body');

        if (categories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state">
                            <div class="empty-state-icon">🏷️</div>
                            <p class="empty-state-text">No categories yet</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = categories.map(category => {
            const bookCount = books.filter(b => b.categoryId === category.id).length;

            return `
                <tr>
                    <td>#${category.id}</td>
                    <td>${category.name}</td>
                    <td>${bookCount}</td>
                    <td>
                        <button class="btn btn-info btn-sm btn-icon" onclick="editCategory(${category.id}, '${category.name.replace(/'/g, "\\'")}')" title="Edit">
                            ✏️
                        </button>
                        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteCategoryConfirm(${category.id})" title="Delete">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function editCategory(id, name) {
    document.getElementById('category-id').value = id;
    document.getElementById('category-name').value = name;
    document.getElementById('category-submit-btn').textContent = '💾 Update';
}

async function deleteCategoryConfirm(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            await apiRequest(`/categories/${id}`, 'DELETE');
            alert('Category deleted!');
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const categoryId = document.getElementById('category-id').value;
            const categoryName = document.getElementById('category-name').value;

            try {
                if (categoryId) {
                    await apiRequest(`/categories/${categoryId}`, 'PUT', { name: categoryName });
                    alert('Category updated!');
                } else {
                    await apiRequest('/categories', 'POST', { name: categoryName });
                    alert('Category added!');
                }

                categoryForm.reset();
                document.getElementById('category-submit-btn').textContent = '➕ Add Category';
                loadCategories();
            } catch (error) {
                console.error('Error saving category:', error);
                alert('Failed to save category');
            }
        });
    }
});

// ===== AUTHORS =====
async function loadAuthors() {
    try {
        const authors = await apiRequest('/authors');
        const books = await apiRequest('/books');
        const tbody = document.getElementById('authors-table-body');

        if (authors.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state">
                            <div class="empty-state-icon">✍️</div>
                            <p class="empty-state-text">No authors yet</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = authors.map(author => {
            const bookCount = books.filter(b => b.authorId === author.id).length;

            return `
                <tr>
                    <td>#${author.id}</td>
                    <td>${author.name}</td>
                    <td>${bookCount}</td>
                    <td>
                        <button class="btn btn-info btn-sm btn-icon" onclick="editAuthor(${author.id}, '${author.name.replace(/'/g, "\\'")}')" title="Edit">
                            ✏️
                        </button>
                        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteAuthorConfirm(${author.id})" title="Delete">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading authors:', error);
    }
}

function editAuthor(id, name) {
    document.getElementById('author-id').value = id;
    document.getElementById('author-name').value = name;
    document.getElementById('author-submit-btn').textContent = '💾 Update';
}

async function deleteAuthorConfirm(id) {
    if (confirm('Are you sure you want to delete this author?')) {
        try {
            await apiRequest(`/authors/${id}`, 'DELETE');
            alert('Author deleted!');
            loadAuthors();
        } catch (error) {
            console.error('Error deleting author:', error);
            alert('Failed to delete author');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authorForm = document.getElementById('author-form');
    if (authorForm) {
        authorForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const authorId = document.getElementById('author-id').value;
            const authorName = document.getElementById('author-name').value;

            try {
                if (authorId) {
                    await apiRequest(`/authors/${authorId}`, 'PUT', { name: authorName });
                    alert('Author updated!');
                } else {
                    await apiRequest('/authors', 'POST', { name: authorName });
                    alert('Author added!');
                }

                authorForm.reset();
                document.getElementById('author-submit-btn').textContent = '➕ Add Author';
                loadAuthors();
            } catch (error) {
                console.error('Error saving author:', error);
                alert('Failed to save author');
            }
        });
    }
});

// ===== MEMBERS =====
async function loadMembers() {
    try {
        const members = await apiRequest('/members');
        const tbody = document.getElementById('members-table-body');

        if (members.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <p class="empty-state-text">No members yet</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = members.map(member => `
            <tr>
                <td>#${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone || 'N/A'}</td>
                <td>${member.member_since || 'N/A'}</td>
                <td>
                    <button class="btn btn-info btn-sm btn-icon" onclick="editMember(${member.id})" title="Edit">
                        ✏️
                    </button>
                    <button class="btn btn-danger btn-sm btn-icon" onclick="deleteMemberConfirm(${member.id})" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

function showAddMember() {
    document.getElementById('add-member-form').classList.remove('hidden');
    document.getElementById('member-form').reset();
    document.getElementById('member-id').value = '';
    document.getElementById('member-date').value = new Date().toISOString().split('T')[0];
}

function hideAddMember() {
    document.getElementById('add-member-form').classList.add('hidden');
}

async function editMember(id) {
    try {
        const members = await apiRequest('/members');
        const member = members.find(m => m.id === id);
        if (member) {
            showAddMember();
            document.getElementById('member-id').value = member.id;
            document.getElementById('member-name').value = member.name;
            document.getElementById('member-email').value = member.email;
            document.getElementById('member-phone').value = member.phone || '';
            document.getElementById('member-date').value = member.member_since || '';
        }
    } catch (error) {
        console.error('Error loading member:', error);
    }
}

async function deleteMemberConfirm(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        try {
            await apiRequest(`/members/${id}`, 'DELETE');
            alert('Member deleted!');
            loadMembers();
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Failed to delete member');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const memberForm = document.getElementById('member-form');
    if (memberForm) {
        memberForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const memberData = {
                name: document.getElementById('member-name').value,
                email: document.getElementById('member-email').value,
                phone: document.getElementById('member-phone').value,
                memberSince: document.getElementById('member-date').value
            };

            const memberId = document.getElementById('member-id').value;

            try {
                if (memberId) {
                    await apiRequest(`/members/${memberId}`, 'PUT', memberData);
                    alert('Member updated!');
                } else {
                    await apiRequest('/members', 'POST', memberData);
                    alert('Member added!');
                }

                hideAddMember();
                loadMembers();
            } catch (error) {
                console.error('Error saving member:', error);
                alert('Failed to save member');
            }
        });
    }
});

// ===== BORROW =====
async function loadBorrowPage() {
    try {
        const members = await apiRequest('/members');
        const books = await apiRequest('/books');
        const availableBooks = books.filter(b => b.availableCopies > 0);

        // Populate member dropdown
        const memberSelect = document.getElementById('borrow-member');
        memberSelect.innerHTML = '<option value="">Select Member</option>' +
            members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

        // Populate book dropdown
        const bookSelect = document.getElementById('borrow-book');
        bookSelect.innerHTML = '<option value="">Select Book</option>' +
            availableBooks.map(b => `<option value="${b.id}">${b.title} (${b.availableCopies} available)</option>`).join('');

        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        document.getElementById('borrow-date').value = today;
        document.getElementById('return-date').value = twoWeeksLater;

        // Load active borrows
        await loadBorrowsTable();
    } catch (error) {
        console.error('Error loading borrow page:', error);
    }
}

async function loadBorrowsTable() {
    try {
        const borrows = await apiRequest('/borrows');
        const activeBorrows = borrows.filter(b => b.status === 'active');
        const tbody = document.getElementById('borrows-table-body');

        if (activeBorrows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <div class="empty-state-icon">📭</div>
                            <p class="empty-state-text">No active borrows</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = activeBorrows.map(borrow => {
            const isOverdue = new Date(borrow.returnDate) < new Date();

            return `
                <tr>
                    <td>${borrow.memberName || 'Unknown'}</td>
                    <td>${borrow.bookTitle || 'Unknown'}</td>
                    <td>${borrow.borrowDate}</td>
                    <td>${borrow.returnDate}</td>
                    <td>
                        <span class="badge ${isOverdue ? 'badge-danger' : 'badge-success'}">
                            ${isOverdue ? 'Overdue' : 'Active'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="returnBookConfirm(${borrow.id})">
                            ✅ Return
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading borrows:', error);
    }
}

async function returnBookConfirm(borrowId) {
    if (confirm('Mark this book as returned?')) {
        try {
            await apiRequest(`/borrows/${borrowId}/return`, 'PUT');
            alert('Book returned successfully!');
            await loadBorrowsTable();
            await loadDashboard();
        } catch (error) {
            console.error('Error returning book:', error);
            alert('Failed to return book');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const borrowForm = document.getElementById('borrow-form');
    if (borrowForm) {
        borrowForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const borrowData = {
                memberId: parseInt(document.getElementById('borrow-member').value),
                bookId: parseInt(document.getElementById('borrow-book').value),
                borrowDate: document.getElementById('borrow-date').value,
                returnDate: document.getElementById('return-date').value
            };

            try {
                await apiRequest('/borrows', 'POST', borrowData);
                alert('Book borrowed successfully!');
                await loadBorrowPage();
                await loadDashboard();
            } catch (error) {
                console.error('Error borrowing book:', error);
                alert('Failed to borrow book');
            }
        });
    }
});

// ===== PDF EXPORT =====
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    try {
        const books = await apiRequest('/books');

        // Title
        doc.setFontSize(18);
        doc.text('Silaanyo Library - Book Inventory', 20, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Total Books: ${books.length}`, 20, 37);

        // Books
        let y = 50;
        doc.setFontSize(12);

        books.forEach((book, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.text(`${index + 1}. ${book.title}`, 20, y);
            y += 7;
            doc.setFontSize(10);
            doc.text(`   Author: ${book.authorName || 'Unknown'} | Category: ${book.categoryName || 'Unknown'}`, 20, y);
            y += 5;
            doc.text(`   ISBN: ${book.isbn || 'N/A'} | Copies: ${book.copies}`, 20, y);
            y += 10;
            doc.setFontSize(12);
        });

        doc.save('library-inventory.pdf');
        alert('PDF exported successfully!');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export PDF');
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Load initial page
    loadDashboard();
});
