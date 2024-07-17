const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get("/", async function (req, res) {
  try {
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = books[isbn];
    if (book) {
      return res.json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    let booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      return res.json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    let booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      return res.json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = books[isbn];
    if (book && book.reviews) {
      return res.json(book.reviews);
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book review", error: error.message });
  }
});

module.exports.general = public_users;
