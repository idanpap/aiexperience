// src/index.js
const express = require('express')
const cors = require('cors')
const notesRouter = require('./routes/notes')

const app = express()
const PORT = process.env.PORT || 9000

app.use(cors())
app.use(express.json())

app.use('/api/notes', notesRouter)

app.get('/', (req, res) => {
  res.send('Welcome to the Notes Management API')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
