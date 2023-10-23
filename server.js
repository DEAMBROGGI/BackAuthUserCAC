const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./config/database.js')
const Router = require('./routes/routes')

const app = express()

const PORT = process.env.PORT || 5000

app.set("port", PORT)

app.use(cors())
app.use(express.json())
app.use('/api', Router)

app.listen(PORT, ()=>{
    console.log("Servidor corriendo en puerto: "+app.get('port')) 
})

