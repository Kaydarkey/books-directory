document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('bookList');
    const searchBar = document.getElementById('searchBar');
    const addBookForm = document.getElementById('addBookForm');

    // Fetch and display books
    const fetchBooks = async () => {
        const res = await fetch('/api/books');
        const books = await res.json();
        displayBooks(books);
    };

    // Display books
    const displayBooks = (books) => {
        bookList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book');
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Published Year:</strong> ${book.publishedYear}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <button onclick="deleteBook('${book._id}')">Delete</button>
            `;
            bookList.appendChild(bookItem);
        });
    };

    // Search books
    searchBar.addEventListener('input', async (e) => {
        const searchString = e.target.value.toLowerCase();
        const res = await fetch('/api/books');
        const books = await res.json();
        const filteredBooks = books.filter(book => {
            return (
                book.title.toLowerCase().includes(searchString) ||
                book.author.toLowerCase().includes(searchString) ||
                book.genre.toLowerCase().includes(searchString)
            );
        });
        displayBooks(filteredBooks);
    });

    // Add a new book
    addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            publishedYear: document.getElementById('publishedYear').value,
            description: document.getElementById('description').value,
        };

        await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        fetchBooks();
        addBookForm.reset();
    });

    // Delete a book
    window.deleteBook = async (id) => {
        await fetch(`/api/books/${id}`, {
            method: 'DELETE'
        });
        fetchBooks();
    };

    // Initial fetch of books
    fetchBooks();
});
