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

const CheckAuth = (req, res, next) => {

    if (jwt.decode(req.headers.authorization.split(' ')[1], 'secretKEY').username === 'salem') {
        next()
    } else {
        res.json({ message: 'not logged in' })
    }

}

//get  http://localhost:5000
app.get('/', (req, res) => {

    res.render('index')
})
app.get('/user', (req, res) => {

    res.status(403).send('<h1>Not logged in</h1>');

})

app.post('/user', (req, res) => {

    const user = {
        username: req.body.name,
        password: req.body.password,
    }

    const NewUser = new User(user)
    /* NewUser.save(err => {
        if (err) {
            console.log('user not saved');
        } else {
            console.log('user saved');
        }
    })
 */
    const token = jwt.sign(user, 'secretKEY')

    console.log(token);
    res.render('users', { NewUser })
})

app.get('/new_route', CheckAuth, (req, res) => {
    res.send('<h1>new route</h1>');
});

const port = 5000


app.listen(port, () => { console.log(`nodemon is listening...`) })