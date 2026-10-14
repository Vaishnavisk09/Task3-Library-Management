/**
 * Task3 - Book REST API
 * A simple in-memory REST API for managing books using Node.js and Express.js
 *
 * Endpoints:
 *   GET    /books        → Return all books
 *   POST   /books        → Add a new book
 *   PUT    /books/:id    → Update an existing book by ID
 *   DELETE /books/:id    → Delete a book by ID
 */

const express = require('express');
const app = express();

// ─── Port Configuration ───────────────────────────────────────────────────────
const PORT = 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
// Parse incoming requests with JSON payloads
app.use(express.json());

// ─── In-Memory Data Store ─────────────────────────────────────────────────────
// Books are stored as an array of objects (no database used).
// Each book has: id (number), title (string), author (string)
let books = [
  { id: 1, title: 'The Alchemist',             author: 'Paulo Coelho'   },
  { id: 2, title: 'To Kill a Mockingbird',     author: 'Harper Lee'     },
  { id: 3, title: 'The Great Gatsby',          author: 'F. Scott Fitzgerald' },
];

// ─── ID Counter ───────────────────────────────────────────────────────────────
// Keeps incrementing so that deleted IDs are never reused.
let nextId = 4;

// ─────────────────────────────────────────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates that title and author are present and are non-empty strings.
 * Returns an array of error messages (empty if valid).
 */
function validateBookFields(title, author) {
  const errors = [];

  if (title === undefined || title === null) {
    errors.push('"title" field is required.');
  } else if (typeof title !== 'string' || title.trim() === '') {
    errors.push('"title" must be a non-empty string.');
  }

  if (author === undefined || author === null) {
    errors.push('"author" field is required.');
  } else if (typeof author !== 'string' || author.trim() === '') {
    errors.push('"author" must be a non-empty string.');
  }

  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// ── GET /books ────────────────────────────────────────────────────────────────
// Returns the full list of books.
// HTTP 200 on success.
app.get('/books', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Books retrieved successfully.',
    count: books.length,
    data: books,
  });
});

// ── POST /books ───────────────────────────────────────────────────────────────
// Creates a new book.
// Expects JSON body: { "title": "...", "author": "..." }
// HTTP 201 on success, HTTP 400 on validation failure.
app.post('/books', (req, res) => {
  const { title, author } = req.body;

  // Validate input fields
  const errors = validateBookFields(title, author);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the request body.',
      errors: errors,
    });
  }

  // Create and store the new book
  const newBook = {
    id:     nextId++,
    title:  title.trim(),
    author: author.trim(),
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: 'Book created successfully.',
    data: newBook,
  });
});

// ── PUT /books/:id ────────────────────────────────────────────────────────────
// Updates an existing book identified by :id in the URL.
// Expects JSON body: { "title": "...", "author": "..." }
// HTTP 200 on success, HTTP 400 on bad input, HTTP 404 if not found.
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  // Validate that :id is a valid positive integer
  if (isNaN(bookId) || bookId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID. The ID must be a positive integer.',
    });
  }

  // Find the book in the array
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${bookId} was not found.`,
    });
  }

  const { title, author } = req.body;

  // Validate input fields
  const errors = validateBookFields(title, author);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the request body.',
      errors: errors,
    });
  }

  // Update the book in place
  books[bookIndex] = {
    id:     bookId,
    title:  title.trim(),
    author: author.trim(),
  };

  res.status(200).json({
    success: true,
    message: 'Book updated successfully.',
    data: books[bookIndex],
  });
});

// ── DELETE /books/:id ─────────────────────────────────────────────────────────
// Deletes an existing book identified by :id in the URL.
// HTTP 200 on success, HTTP 404 if not found.
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  // Validate that :id is a valid positive integer
  if (isNaN(bookId) || bookId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID. The ID must be a positive integer.',
    });
  }

  // Find the book in the array
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${bookId} was not found.`,
    });
  }

  // Remove the book from the array
  const deletedBook = books.splice(bookIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Book deleted successfully.',
    data: deletedBook,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  GLOBAL ERROR HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

// Catch-all for unknown routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' not found. Check the URL and try again.`,
  });
});

// Global error handler (catches JSON parse errors, etc.)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body. Please send valid JSON.',
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again.',
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  START SERVER
// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('─────────────────────────────────────────');
  console.log(`  Book REST API — Server is running`);
  console.log(`  URL : http://localhost:${PORT}`);
  console.log(`  GET  http://localhost:${PORT}/books`);
  console.log('─────────────────────────────────────────');
});
