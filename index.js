const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')

const { url } = require('./constants/mongodb')
const calendarRoute = require('./routes/calendar')
const exerciseRoute = require('./routes/exercise')
const userRoute = require('./routes/user')
const regionRoute = require('./routes/region')


// For the correct handling req.body in routes
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})


app.use('/calendar', calendarRoute)
app.use('/exercise', exerciseRoute)
app.use('/user', userRoute)
app.use('/region', regionRoute)

const PORT = process.env.PORT || 3000



async function start() {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
        app.listen(PORT, () => {
            console.log('Server was started on port ' + PORT)
        })
    } catch (error) {
        console.log(error)
    }
}

start()