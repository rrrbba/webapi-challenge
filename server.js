const express = require('express');
const actionRouter = require('./actionRouter');
const projectRouter = require('./projectRouter');


const server = express();

server.use(express.json());

server.use('/actions', actionRouter)

server.use('/projects', projectRouter)

server.get('/',  (req, res) => {
    res.send(`<h1>TEST</h1>`)
});


module.exports = server;