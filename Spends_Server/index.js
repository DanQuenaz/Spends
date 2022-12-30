const express = require('express')
const app = express()
const database = require('./config/db')
const consign = require('consign')

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = database
port = 2911

app.listen(port, () => {
    console.log('Servidor rodando na porta ' + port)
})