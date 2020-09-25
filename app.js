const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/userModel.js')
const cookieParser = require('cookie-parser')

const app = express()

mongoose.connect('mongodb://localhost:27017/usersAuthDB', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => console.log('database connected'))

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()); //to parse cookies 


//get  http://localhost:5000
app.get('/', (req, res) => {
    console.log(req.cookies.token);
    res.render('index')
})

app.post('/user', (req, res) => {
    const NewUser = new User({
        username: req.body.name,
        password: req.body.password,
    })
    NewUser.save(err => {
        if (err) {
            console.log('user not saved');
        } else {
            console.log('user saved');
        }
    })

    const token = jwt.sign({ NewUser }, 'secretKEY')
    
    res.cookie('token',token)
    res.render('users', { NewUser })
})

const port = 5000


app.listen(port, () => { console.log(`nodemon is listening...`) })