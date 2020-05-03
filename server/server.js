const express = require('express');
const app = express();
const mongoose = require('mongoose');


// @ts-ignore
require('./config/config');

let usuario = require('./routes/usuario');
// para uso x-www-form-encoded paso de parametros por html
const bp = require('body-parser');

// const port = require('./server/config/config').port;

// parse application/x-www-form-urlencoded : Middleware
app.use(bp.urlencoded({ extended: false }));

// parse application/json : Middleware
app.use(bp.json());

app.use(usuario);

// const options = (require('./config/config').mongodb === 'env') ? { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true } : {};

mongoose.connect(process.env.URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, (error, resp) => {
    if (error) {
        return console.log('Error de conexion a BD CafeDB : ', error);
    }
    console.log('Base de datos CafeDB inicializada', resp.client.s.url);
});

app.listen(process.env.PORT, () => {
    console.log('Server: http://localhost:', process.env.PORT);
});