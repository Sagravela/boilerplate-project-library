/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');

const collection = 'Books'

// Define a Mongoose schema
const bookSchema = new mongoose.Schema({
  title: String,
  comments: {
    type: [String],
    default: []
  }
});

// Create a Mongoose model
const Book = mongoose.model('Book', bookSchema, collection);

module.exports = function (app) {
  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find()
        .then((arr) => {
          return res.send(arr.map((item) => ({
            _id: item._id,
            title: item.title,
            commentcount: item.comments.length
          })));
        })
        .catch((err) => {
          console.log(err);
        });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title 
      if (!title) {
        return res.send('missing required field title');
      }
      const newBook = new Book({ title: title })
      newBook.save()
        .then((savedBook) => {
          return res.json({
            _id: savedBook._id,
            title: savedBook.title
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({})
        .then((success) => {
          res.send('complete delete successful');
        })
        .catch((err) => {
          console.log(err);
        });
    });

  

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid)
        .select('-__v')
        .then((book) => {
          if (!book) {
            return res.send('no book exists');
          }
          return res.json(book);          
        })
        .catch((err) => {
          return;
        });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.send('missing required field comment');
      }
      Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true })
        .select('-__v')
        .then((book) => {
          if (!book) {
            return res.send('no book exists');
          }
          return res.json(book);
        })
        .catch((err) => {
          return;
        })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid)
        .then((book) => {
          if (!book) {
            return res.send('no book exists');
          }
          return res.send('delete successful')
        })
        .catch((err) => {
          return;
        })
    });
};
