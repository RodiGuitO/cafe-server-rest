// configuracion de puertos
// @ts-ignore
process.env.PORT = process.env.PORT || 3000;

// verifico base de datos: dev = desarrollo
const mongodb = process.env.NODE_ENV || 'dev';

const url_db = (mongodb === 'dev') ?
    'mongodb://localhost:27017/CafeDB' :
    process.env.MONGO_URI;

process.env.URL = url_db;

// module.exports = { mongodb };