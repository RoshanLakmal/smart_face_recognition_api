const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'roshanlakmal',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id:'123',
            name:'John',
            email:'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id:'124',
            name:'Sally',
            email:'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req,res)=>{
    res.send(database.users);
})

app.post('/signin', (req,res)=>{
    bcrypt.compare("cookiesa", "$2a$10$4EWfkp1VD1jVqnlv/oDL/O/WkDOzdAfwShNGEze9WxfBea.zZPOqS", function(err, res) {
        // res == true
        console.log(res);
    });
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
        //res.json('success');
    }else{
        res.status(400).json('error logging in');
    }
   
})

app.post('/register', (req,res)=>{
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
        // Store hash in your password DB.
    });
    db('users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.put('/image', (req,res)=>{
    const { id } = req.body;
   db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if(entries.length){
            res.json(entries[0]);
        }else{
            res.status(400).json('Not found')
        }
    }) 
    .catch(err => res.status(400).json('unable to get entries'))
})

app.get('/profile/:id', (req,res)=>{
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if(user.length){
                res.json(user[0])
            }else{
                res.status(400).json('Not found')
            }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.listen(3000, ()=>{
    console.log("app is running on port 3000");
});