require('../config/config');
let mongoose = require('./db/mongoose');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt  = require('jsonwebtoken');
const auth = require('./auth/auth');
const authConfig = require('./auth/authConfig');
const _ = require('lodash');
const {User} = require('./models/user');
const bcrypt = require('bcryptjs');


let app = express();

  
app.use(bodyParser.json());
app.use(auth().initialize());

  

app.post('/todos' , auth().authenticate() ,(req,res) => {
    res.send({
        _todos:[{
            text:'feed the dog'
        },{
            text:'feed the cat'
        }]
    });
})

app.post('/login' , (req,res) => {

    let body = _.pick(req.body , ['email' , 'password']);
    User.findOne({email: body.email}).then((user) => {
        if(!user)
        {
            return res.status(404).send({error : 'email or password is incorrect'});
        }
        if(user.password !== body.password)
        {
            return res.status(404).send({error : 'email or password is incorrect'});
        }

        let payLoad = {
            _id : user._id
        }

        let token = jwt.sign(payLoad,authConfig.jwtSecret);
        return res.status(200).send({token});
    }).catch((error) => {
        res.status(400).send(error);
    })


});

app.post('/signup' , (req,res) => {

    let body = _.pick(req.body , ['email' , 'password']);
    let newUser = new User(body);
    newUser.save().then((user) => {
        res.status(200).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    })


});


app.listen(process.env.PORT, () => {
    console.log('starting server .... ');
})