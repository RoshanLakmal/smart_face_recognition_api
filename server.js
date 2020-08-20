const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
        res.json('success');
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
    database.users.push({
            id:'1',
            name: name,
            email: email,
            entries: 0,
            joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
   
})

app.put('/image', (req,res)=>{
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++;
            res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
   
})

app.get('/profile/:id', (req,res)=>{
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            res.json(user);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
})

app.listen(3000, ()=>{
    console.log("app is running on port 3000");
});