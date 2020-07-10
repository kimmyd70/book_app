'use strict';

require('dotenv').config();

const PORT = process.env.PORT;

//bring in dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const morgan = require('morgan');
const  superagent= require('superagent');
const { request } = require('express');

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


//Need function to change http: to https: (card)
app.post('/new-search', handleSearch);



function handleSearch(req,res){
const safeQuery = {
  q : request.body.userInput,
  search: request.body.value,
  parameter: request.body.author || request.body.title,
  // format: 'json'
}
const API = `https://www.googleapis.com/books/v1/volumes?q=+${safeQuery.parameter}:${safeQuery.q}`

//&key=${safeQuery.key}

superagent
.get(API)
// .query(safeQuery)

  .then(data =>{
    data.items.map(obj =>{
      return new Book()

    });
  });


}

function Book (obj) {
  this.title = obj.title || ('title is not available');
  this.image = obj.image || ('https://i.imgur.com/J5LVHEL.jpg');
  //authors is an array
  this.author = obj.authors || ('author is unknown');
  this.description = obj.description || ('description is not available');
  this.isbn = obj.isbn || ('ISBN is not available');
  this.categories = obj.categories || ('category is not available');
}


//start server
app.listen(PORT,()=>console.log(`I am listening on ${PORT}`));
