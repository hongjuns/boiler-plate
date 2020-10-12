const express = require('express');
const mongoose = require('mongoose');
const mongodbUser = require('./lib/mongodbUser');
const app = express();
const port = 3000


mongoose.connect(mongodbUser.mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('MongoDB connected ...'))
  .catch(err => console.log(err))


app.get('/', function (req, res) {
  res.send('Hello World!');
});
  
app.listen(port, ()=>
console.log(`Example app listening on port ${port} !`))
