const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/../../.env') })
const express = require('express')
const port = process.env.PORT

const mongoose = require('mongoose')
var ObjectId = require('mongoose').Types.ObjectId;
const { Task } = require("./Schems/taskSchem")
const uniqid = require("uniqid")

const uri = process.env.DB_URI

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const run = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        // console.log('HOST:',mongoose.connections[0].host)
        // console.log('PORT:',mongoose.connections[0].port)
        console.log(`using ${mongoose.connections[0].name} db`)
        console.log(`Connected to ${mongoose.connections[0].host}`)
    } catch (error) {
        console.log(error)
    }
}
run()

// GET: test connection
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Connection established' })
})

// GET: get all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find({})

    res.status(200).send(tasks)
})

// GET: get one task
app.get('/api/tasks/:id', async (req, res) => {
    // if (!String(id)) {
    //     res.status(400).send({ message: 'Invalid identifier.' })
    //     return
    // }

    let task
    try {
        task = await Task.findOne({ uid: req.params.id })
    } catch (error) {
        console.error(error)
    }

    if (!task) {
        res.status(404).send({ message: 'Task not found.' })
        return
    }

    res.status(200).send(task)
})

// POST: create new tasks
app.post('/api/tasks', async (req, res) => {
    try {
        const { text, day, reminder } = req.body
        if (!text) {
            res.status(400).send({ message: 'Please add a task' })
            return
        }
        console.log('task', req.body)

        const uid = uniqid().toString()

        const newTask = await Task.create({
            uid: uid,
            text: text,
            day: day || "",
            reminder: reminder || false,
        })

        if (!newTask) {
            res.status(500).send({ message: "Could not create task" })
            return
        }

        res.status(201).send(newTask)
    } catch (error) {
        console.error(error)
    }
})

// PUT: update one task
app.put('/api/tasks/:id', async (req, res) => {
    const taskToUpdate = await Task.updateOne({ uid: req.params.id }, req.body)
    console.log('taskToUpdate', taskToUpdate)

    if (taskToUpdate.modifiedCount <= 0) {
        res.status(500).send({ message: 'Could not update task' })
        return
    }

    const updatedTask = await Task.findOne({ uid: req.params.id })

    if (!updatedTask) {
        res.status(404).send({ message: 'Task not found.' })
        return
    }

    res.status(200).send(updatedTask)
})

// DELETE: delete one task
app.delete('/api/tasks/:id', async (req, res) => {
    const taskToDelete = await Task.deleteOne({ uid: req.params.id })
    console.log('taskToDelete', taskToDelete)

    if (taskToDelete.deletedCount <= 0) {
        res.status(500).send({ message: 'Could not delete task' })
        return
    }

    res.status(204).send()
})

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/../../client/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../../client/dist', 'index.html'))
    })
}

app.listen(port, () => console.log(`server running on port ${port}`))