'use strict';

require('dotenv').config();

const PORT = process.env.PORT;

//bring in dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const morgan = require('morgan');
const  superagent= require('superagent');

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

app.post('/search-by-author',(req,res)=>{
  console.log(req.body)
});
app.post('/search-by-title',(req,res)=>{
  console.log(req.body)

});


//start server
app.listen(PORT,()=>console.log(`I am listening on ${PORT}`));
