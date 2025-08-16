const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ------------------
// Task 6: Register a new user
// ------------------
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// ------------------
// Task 1: Get all books
// ------------------
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// ------------------
// Task 2: Get book by ISBN
// ------------------
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

// ------------------
// Task 3: Get book by author
// ------------------
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const filtered = Object.values(books).filter(b => b.author.toLowerCase() === author);
  return res.status(200).json(filtered);
});

// ------------------
// Task 4: Get book by title
// ------------------
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const filtered = Object.values(books).filter(b => b.title.toLowerCase() === title);
  return res.status(200).json(filtered);
});

// ------------------
// Task 5: Get book reviews
// ------------------
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book.reviews);
  return res.status(404).json({ message: "Book not found" });
});

// ========================================================================
// Tasks 10–13: Async/Await Versions (Extra Endpoints for Peer Review)
// ========================================================================

// Task 10: Get all books (async)
public_users.get('/async/books', async (req, res) => {
  const allBooks = await new Promise((resolve, reject) => {
    resolve(books);
  });
  return res.status(200).json(allBooks);
});

// Task 11: Get book by ISBN (async)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const book = await new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

// Task 12: Get book by author (async)
public_users.get('/async/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  const filteredBooks = await new Promise((resolve, reject) => {
    const results = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author
    );
    resolve(results);
  });
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 13: Get book by title (async)
public_users.get('/async/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  const filteredBooks = await new Promise((resolve, reject) => {
    const results = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title
    );
    resolve(results);
  });
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

module.exports.general = public_users;
