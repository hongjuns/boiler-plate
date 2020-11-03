const express = require('express');
const mongoose = require('mongoose');
const config = require('../config/key');
const app = express();
const port = 3000

const { User } = require('../models/User');
const { auth } = require('../middleware/auth')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//DB 연결
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('MongoDB connected ...'))
  .catch(err => console.log(err))

//회원가입 API
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

//로그인 API
app.post('/login', (req,res)=> {
  //요청된 이메일이 데이터베이스에 있는지 확인
  User.findOne({ email : req.body.email }, (err, user) => {
      if(!user){
        return res.json({
          loginSuccess : false,
          msg:'이메일을 확인해주세요.'
        })
      }
      
      user.comparePassword(req.body.password, (err, isMatch)=>{
        if(!isMatch){
          return res.json({
            loginSuccess : false,
            msg:'비밀번호를 확인해주세요.'
          })
        }
        user.generateToken((err, user)=>{
            if(err) return res.status(400).send(err);

            res.cookie("x_auth", user.token)
            .status(200)
            .json({
              loginSuccess : true,
              userId:user._id
            })

        })
      })
  })
})

//auth Api 
app.get('/api/users/auth', auth , (req,res) => {
  res.status(200).json({
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image


  })
});

app.get('/', function (req, res) {
  res.send('Boiler-Plate API');
});
  
app.listen(port, ()=>
console.log(`Example app listening on port ${port} !`))
