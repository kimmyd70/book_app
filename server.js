'use strict';

require('dotenv').config();

const PORT = process.env.PORT;

//bring in dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const morgan = require('morgan');
const superagent= require('superagent');

//initialize express
const app = express();

//set up EJS
app.set('view engine', 'ejs');

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

// routes

app.get('/',(req,res)=>{
  res.render('pages/searches/new');
  
});


app.post('/searches', handleSearch);


app.get('/*', (req,res)=>{
      res.render('pages/error');
    });

function handleSearch(req,res){
  const safeQuery = {
    q : req.body.userInput,
    search: req.body.search,
  };
  
  const API = `https://www.googleapis.com/books/v1/volumes?q=${safeQuery.search}:${safeQuery.q}`;
  
  //Need function to change http: to https: (card)
  
  superagent.get(API)
  // .query(safeQuery)
  .then(data =>{
    console.log(data.body.items[0]);
    let newData = data.body.items.map(obj =>{
      return new Book(obj);
      
    });
    res.render('pages/searches/show',{books:newData});
  });
};


function Book (obj) {
  this.title = obj.volumeInfo.title || ('title is not available');
  this.image = obj.volumeInfo.imageLinks.thumbnail || obj.volumeInfo.imageLinks.smallThumbnail || ('https://i.imgur.com/J5LVHEL.jpg');
  //authors is an array
  this.author = obj.volumeInfo.authors || ('author is unknown');
  this.description = obj.volumeInfo.description || ('description is not available');
  this.isbn = obj.volumeInfo.industryIdentifiers[0].identifier || ('ISBN is not available');
  // this.categories = obj.categories || ('category is not available');
}


//start server
app.listen(PORT,()=>console.log(`I am listening on ${PORT}`));
    
