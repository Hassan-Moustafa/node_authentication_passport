require('../config/config');
let mongoose = require('./db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const jwt  = require('jsonwebtoken');
const auth = require('./auth/auth');
const authConfig = require('./auth/authConfig');
const _ = require('lodash');
const {User} = require('./models/user');
const signUp = require('./auth/signUp');
const logIn = require('./auth/logIn');
const logOut = require('./auth/logOut');


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

    logIn(req).then((token) => {
        res.status(200).send(token);
    }).catch((error) => {
        res.status(400).send(error);
    })
});

app.post('/signup' , (req,res) => {

    
    signUp(req).then((user) => {
        res.status(200).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });

});

app.delete('/logout' , auth().authenticate() , (req,res) => {

    logOut(req).then(() => {
        res.status(200).send({state : 'logged out'});
    })
})


app.listen(process.env.PORT, () => {
    console.log('starting server .... ');
})