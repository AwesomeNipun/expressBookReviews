const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean

  let valid_users = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (valid_users.length > 0) {
    return true;
  }

  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error loggin in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).json({message:"User successfully logged in"});
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
// Hint: You have to give a review as a request query & it must get posted with the username (stored in the session) posted. 
// If the same user posts a different review on the same ISBN, it should modify the existing review. 
// If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.

regd_users.put("/auth/review/:isbn", (req, res) => {

  let review = req.query.review;
  let username = req.session?.authorization?.username;

  if (!review || !username) {
      return res.status(400).json({ message: "Review or username not provided" });
  }

  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.reviews[username] = review;
  return res.status(200).json({ message: "Review successfully added/updated" });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  let username = req.session?.authorization?.username;

  if (!username) {
      return res.status(400).json({ message: "Username not provided" });
  }

  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  if (book.reviews && book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review successfully deleted" });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
