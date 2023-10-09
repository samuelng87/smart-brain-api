const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const { user } = require('pg/lib/defaults');


const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'samuelng',
      password : '',
      database : 'smart-brain'
    }
  });


const app = express();



const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries:0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            email: 'sally@example.com',
            password: 'bananas',
            entries:0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '123',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error loging in');
    }
})


app.post('/register', (req, res) => {
    const {email, name , password } = req.body;

    db('users')
    .returning('*')
    .insert({
        email: email, 
        name: name, 
        joined: new Date()
    })
    .then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json('Resgistered User'))
})


app.get('/profile/:id', (req, res) => { 
    const {id} = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => { 
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('No such user');
    }
})

 



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


        // Load hash from your password DB.
    // bcrypt.compare("apples", hash, function(err, res) {
    //     console.log('first guess', res)
    // });
    // bcrypt.compare("veggies", hash, function(err, res) {
    //     console.log('second guess', res)
    // });

app.listen(3000, () => {
    console.log('listening on port 3000')
})



