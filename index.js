const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book'); // Ensure this path is correct
const app = express();

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/books-directory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Home route
app.get('/', async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.render('index', { title: 'Books Directory', books: books }); // Pass books array to the template
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).send('Internal Server Error');
  }
});

// API Endpoints

// GET: /api/books - Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST: /api/books - Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genre, publishedYear, description } = req.body;
    const newBook = new Book({ title, author, genre, publishedYear, description });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: /api/books/:id - Get a book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT: /api/books/:id - Update a book by ID
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, genre, publishedYear, description } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, genre, publishedYear, description }, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: /api/books/:id - Delete a book by ID
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
