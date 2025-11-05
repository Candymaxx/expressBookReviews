const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({ username, password });
  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  }
  return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  }
  return res.status(404).json({message: "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

// Task 10: Get all books - Using async callback function
public_users.get('/async/books', async (req, res) => {
  try {
    const allBooks = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Search by ISBN - Using Promises
public_users.get('/async/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err}));
});

// Task 12: Search by Author - Using async/await
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve) => {
      const results = Object.values(books).filter(book => 
        book.author.toLowerCase() === author.toLowerCase()
      );
      resolve(results);
    });
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    }
    return res.status(404).json({message: "No books found for this author"});
  } catch (error) {
    return res.status(500).json({message: "Error searching books"});
  }
});

// Task 13: Search by Title - Using async/await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve) => {
      const results = Object.values(books).filter(book => 
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      resolve(results);
    });
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    }
    return res.status(404).json({message: "No books found with this title"});
  } catch (error) {
    return res.status(500).json({message: "Error searching books"});
  }
});

module.exports.general = public_users;
