const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')


const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'samuelng',
      password : '',
      database : 'smart-brain'
    }
  });

  db.select('*').from('users').then(data => {
      console.log(data);
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
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash)
    // });
        database.users.push({
            id: '126',
            name: name,
            email: email,
            entries:0,
            joined: new Date()
        })
        res.json(database.users[database.users.length - 1])
    })


app.get('/profile/:id', (req, res) => { 
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('No such user');
    }
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



