const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const DB_ADDR = process.env.MONGO_DB_ADDR || 'mongo';
const DB_PORT = process.env.MONGO_DB_PORT || 27017;
const DB_NAME = process.env.MONGO_DATABASE || 'api'
const DB_CONNECTION = 'mongodb://' + DB_ADDR + ':' + DB_PORT + '/' + DB_NAME;

const options = {
    useNewUrlParser: true,
    reconnectTries: 60,
    reconnectInterval: 100
};
const routes = require('./routes/routes.js');
const port = process.env.PORT || 80;
const app = express();
const http = require('http').Server(app);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', routes)
app.use((request, response) => {
    response.status(404)
})



MongoClient.connect(DB_CONNECTION, options, (err, database) => {
    if (err) {
        console.log('url: '+ DB_CONNECTION)
        console.log(`Fatal Mongo Connection Failed: ${err}:${err.stack}`)
        process.exit;
    }

    app.locals.db = database.db('api')
    http.listen(port, () => {
        console.log('listening on port ' + port)
        app.emit('APP STARTED')
    })
})