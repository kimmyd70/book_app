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

//Client connect for DB

const client = new pg.Client(process.env.DATABASE_URL);

//set up EJS
app.set('view engine', 'ejs');

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

//Client connect
client.connect()
  .then(() => console.log('we are up and running'))
  .catch((error) => console.error('client connect problem', error));

// routes

app.get('/', handleHome);
app.post('/searches', handleSearch);
app.get('/searches/new', handleNew);
app.use('*', handleError);

//function that renders homepage
function handleHome(req,res){
  res.render('pages/index');
}

//function that queries Book API and renders results
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
      let newData = data.body.items.map(obj =>{
        return new Book(obj);
      });
      console.log(newData);
      res.render('pages/searches/show',{books:newData});
    });
}

//function that get you to the search page
function handleNew(req,res){
  res.render('pages/searches/new');
}

function handleError (req,res){
  res.render('pages/error');
}

function Book (obj) {
  this.title = obj.volumeInfo.title || ('title is not available');
  this.image = obj.volumeInfo.imageLinks.thumbnail.replace('http://','https://') || obj.volumeInfo.imageLinks.smallThumbnail.replace('http://','https://') || ('https://i.imgur.com/J5LVHEL.jpg');
  //authors is an array
  this.author = obj.volumeInfo.authors || ('author is unknown');
  this.description = obj.volumeInfo.description || ('description is not available');
  this.isbn = obj.volumeInfo.industryIdentifiers[0].identifier || ('ISBN is not available');
  // this.categories = obj.categories || ('category is not available');
}


//start server
app.listen(PORT,()=>console.log(`I am listening on ${PORT}`));
