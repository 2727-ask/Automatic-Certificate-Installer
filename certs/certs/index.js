const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')

const app = express()

app.use('/', (req, res, next) => {
  res.send('Western Union SSL SERVER IS WORKING')
})

const sslServer = https.createServer(
  {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
  },
  app
)

sslServer.listen(3444, () => console.log('Western Union Secure server 🚀🔑 on port 3444'))