const express = require('express')
const app = express()
require('dotenv').config();

const port  = process.env.PORT;

 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(port, ()=>{
    console.log('Servidor corriendo en : ', port);
})