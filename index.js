const express = require('express');
const mongoose = require('mongoose');
const mongodbUser = require('./lib/mongodbUser');
const app = express();
const port = 3000

const { User } = require('./models/User');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(mongodbUser.mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('MongoDB connected ...'))
  .catch(err => console.log(err))


app.post('/register', (req,res)=> {
  const user = new User(req.body);

  user.save((err, doc) => {

    if (err) return res.json({
      success: false,
      err
    })
    
    return res.status(200).json({
      success : true,
      msg :'회원가입이 완료 되었습니다.'
    })
  })

})


app.get('/', function (req, res) {
  res.send('Hello World!');
});
  
app.listen(port, ()=>
console.log(`Example app listening on port ${port} !`))
