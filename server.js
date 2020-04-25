const express = require('express');
const app = express();

// para uso x-www-form-encoded paso de parametros por html
const bp = require('body-parser');

// const port = require('./server/config/config').port;

// parse application/x-www-form-urlencoded : Middleware
app.use(bp.urlencoded({ extended: false }));

// parse application/json : Middleware
app.use(bp.json());


app.get('/', function(req, res) {
    res.json('Server run');
});

// get, post, put, delete, HTTP
app.get('/usuario/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        id,
        message: 'get user found'
    });
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (!body.nombre || !body.email) {
        res.status(400).json({
            ok: false,
            message: 'Post user: bad request'
        });
    }

    res.json({
        ok: true,
        persona: body,
        message: 'Post user found'
    });
});

app.put('/usuario/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        id,
        message: 'Put user found'
    });
});

app.delete('/usuario/:id', (req, res) => {
    const id = req.params.id;

    res.json({
        id,
        message: 'Delete user found'
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log('Server: http://localhost:', process.env.PORT || 3000);
});