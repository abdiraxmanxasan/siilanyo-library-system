// ==========================================
// PUBLIC VIEW - READ ONLY
// ==========================================

const API_URL = 'http://localhost:3000/api';

// Navigation
function navigateTo(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const navLink = document.querySelector(`[data-page="${page}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }

    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });

    const sectionId = page + '-section';
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }

    const titles = {
        'dashboard': 'Dashboard',
        'books': 'Book Catalog',
        'categories': 'Categories',
        'authors': 'Authors'
    };
    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';

    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'books':
            loadBooks();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'authors':
            loadAuthors();
            break;
    }
}

async function apiRequest(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Dashboard
async function loadDashboard() {
    try {
        const stats = await apiRequest('/stats');
        const categories = await apiRequest('/categories');
        const authors = await apiRequest('/authors');

        if (stats) {
            document.getElementById('total-books').textContent = stats.totalBooks || 0;
            document.getElementById('available-books').textContent = stats.availableBooks || 0;
            document.getElementById('total-categories').textContent = categories?.length || 0;
            document.getElementById('total-authors').textContent = authors?.length || 0;
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Books
async function loadBooks() {
    try {
        const books = await apiRequest('/books');
        const tbody = document.getElementById('books-table-body');

        if (!books || books.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <div class="empty-state-icon">📚</div>
                            <p class="empty-state-text">No books available</p>
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
                if (!books) return;

                const filteredBooks = books.filter(book =>
                    book.title.toLowerCase().includes(searchTerm) ||
                    (book.isbn && book.isbn.toLowerCase().includes(searchTerm)) ||
                    (book.authorName && book.authorName.toLowerCase().includes(searchTerm))
                );

                const tbody = document.getElementById('books-table-body');

                if (filteredBooks.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6">
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
                    </tr>
                `).join('');
            } catch (error) {
                console.error('Error searching books:', error);
            }
        });
    }
});

// Categories
async function loadCategories() {
    try {
        const categories = await apiRequest('/categories');
        const books = await apiRequest('/books');
        const tbody = document.getElementById('categories-table-body');

        if (!categories || categories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">
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
            const bookCount = books ? books.filter(b => b.categoryId === category.id).length : 0;

            return `
                <tr>
                    <td>#${category.id}</td>
                    <td>${category.name}</td>
                    <td>${bookCount}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Authors
async function loadAuthors() {
    try {
        const authors = await apiRequest('/authors');
        const books = await apiRequest('/books');
        const tbody = document.getElementById('authors-table-body');

        if (!authors || authors.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">
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
            const bookCount = books ? books.filter(b => b.authorId === author.id).length : 0;

            return `
                <tr>
                    <td>#${author.id}</td>
                    <td>${author.name}</td>
                    <td>${bookCount}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading authors:', error);
    }
}

// PDF Export
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    try {
        const books = await apiRequest('/books');
        if (!books) return;

        doc.setFontSize(18);
        doc.text('Silaanyo Library - Book Catalog', 20, 20);

        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Total Books: ${books.length}`, 20, 37);

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

        doc.save('library-catalog.pdf');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export PDF');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    loadDashboard();
});
