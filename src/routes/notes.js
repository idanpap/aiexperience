// src/routes/notes.js
const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const dataFilePath = path.join(__dirname, '../data/notes.json')

// Helper function to read data
const readData = () => {
  const data = fs.readFileSync(dataFilePath)
  return JSON.parse(data)
}

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
}

// GET all notes
router.get('/', (req, res) => {
  const notes = readData()
  res.json(notes)
})

// POST a new note
router.post('/', (req, res) => {
  const notes = readData()
  const { title, content } = req.body
  const newNote = {
    id: Date.now(),
    title,
    content,
    createdAt: new Date(),
  }
  notes.push(newNote)
  writeData(notes)
  res.status(201).json(newNote)
})

// GET a single note by ID

// PUT update a note

// DELETE a note

module.exports = router
