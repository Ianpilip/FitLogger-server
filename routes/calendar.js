const { Router } = require('express')
const router = Router()
const path = require('path')
const mongoose = require('mongoose')

const Calendar = require('../models/calendar')
const User = require('../models/user')
const Exercise = require('../models/exercise')
const { mongoObjectIdGenerator } = require('../utils/development')
const { groupBy, sortByKey } = require('../utils/calendar')
const { uom } = require('../constants/unit-of-measure')


router.post('/new-training-day', async (req, res) => {
    try {

        //@TODO: Make validation for valid year/month/day, color and comment text

        // check if the workout day exists
        const existedWorkoutDay = (await Calendar.find({
                                        userID: req.body.userID,
                                        year: req.body.year,
                                        month: req.body.month,
                                        day: req.body.day,
                                    }))[0]

        if(existedWorkoutDay === undefined) { // new workout day
            const workoutDay = new Calendar({
                userID: req.body.userID,
                exercise: req.body.exercises,
                year: req.body.year,
                month: req.body.month,
                day: req.body.day,
                color: req.body.color,
                comment: req.body.comment
            })
            newWorkoutDay = await workoutDay.save()
            res.send(newWorkoutDay)
        } else { // update workout day (update the whole data to avoid complex checks both on flutter and node)
            let updatedOrDeletedWorkoutDay = {}
            // if(req.body.update === true) {
            if(req.body.action === 'update') {
                updatedOrDeletedWorkoutDay = await Calendar.findOneAndUpdate(
                    {
                        userID: req.body.userID,
                        year: req.body.year,
                        month: req.body.month,
                        day: req.body.day,
                    },
                    {
                        exercise: req.body.exercises,
                        color: req.body.color,
                        comment: req.body.comment
                    },
                    {new: true} // return new object (with updated data)
                )
            // } else if(req.body.delete === true) { // remove the whole workout day
            } else if(req.body.action === 'delete') { // remove the whole workout day
                updatedOrDeletedWorkoutDay = await Calendar.findOneAndDelete({
                    userID: req.body.userID,
                    year: req.body.year,
                    month: req.body.month,
                    day: req.body.day,
                })
            }
            res.send(updatedOrDeletedWorkoutDay)
        }


        // // check if the workout day exists
        // const existedWorkoutDay = (await Calendar.find({
        //                                 userID: req.body.userID,
        //                                 // exercise: {ID: req.body.exerciseID},
        //                                 year: req.body.year,
        //                                 month: req.body.month,
        //                                 day: req.body.day,
        //                             }))[0]

        // if(existedWorkoutDay === undefined) { // new workout day
        //     const workoutDay = new Calendar({
        //         userID: req.body.userID,
        //         exercise: [{
        //             exerciseID: req.body.exerciseID,
        //             reps: [req.body.reps],
        //             weights: [req.body.weights]
        //         }],
        //         year: req.body.year,
        //         month: req.body.month,
        //         day: req.body.day,
        //         color: req.body.color
        //     })
        //     newWorkoutDay = await workoutDay.save()
        //     console.log(newWorkoutDay)
        //     res.send(newWorkoutDay)
        // } else { // not new workout day
        //     const foundIndex = existedWorkoutDay.exercise.findIndex(e => e.exerciseID == req.body.exerciseID)

        //     if(foundIndex < 0) {
        //         const exercises = [...existedWorkoutDay.exercise, ...[{
        //                                 exerciseID: req.body.exerciseID,
        //                                 reps: req.body.reps,
        //                                 weights: req.body.weights
        //                             }]]
        //         existedWorkoutDay.exercise = exercises
        //     } else {
        //         if(req.body.updateExercise === true) {
        //             // Update all reps by exercise's index
        //             existedWorkoutDay.exercise[foundIndex] = {
        //                 exerciseID: req.body.exerciseID,
        //                 reps: req.body.reps,
        //                 weights: req.body.weights
        //             }
        //         } else if(req.body.deleteExercise === true) {
        //             // Delete exercise by exercise's index
        //             existedWorkoutDay.exercise.splice(foundIndex, 1)
        //         }
        //     }
        //     updatedWorkoutDay = await Calendar.findOneAndUpdate(
        //         {
        //             userID: req.body.userID,
        //             year: req.body.year,
        //             month: req.body.month,
        //             day: req.body.day,
        //         },
        //         {
        //             exercise: existedWorkoutDay.exercise,
        //             color: req.body.color
        //         },
        //         {new: true} // return new object (with updated data)
        //     )


        //     console.log(updatedWorkoutDay)
        //     res.send(updatedWorkoutDay)
        // }

    } catch (error) {
        console.log(error)
        res.send(error)
    }
})


router.get('/get-all/:userID/:tokenID', async (req, res) => {
    try {

        let response = {
            validationErrors: {},
            body: {}
        }

        const user = await User.findById(req.params.userID)

        if(user === undefined) response.validationErrors.user = 'There is no such user'
        if(user !== undefined && user.tokenID !== req.params.tokenID) response.validationErrors.user = 'Token is not valid anymore'

        if(Object.keys(response.validationErrors).length !== 0) return res.send(response)

        const workouts = await Calendar.find({userID: req.params.userID})

        //@TODO: make dynamic checker of undefined, pass the second param, e.g., ['year', 'month', day]
        function groupByTest(array) {
            let total = {}
            array.forEach(function (object) {
                let tempObject = {}
                if(total[object['year']] === undefined) total[object['year']] = {}
                if(total[object['year']][object['month']] === undefined) total[object['year']][object['month']] = {}
                total[object['year']][object['month']][object['day']] = object
            })
            return total
        }
        const result = groupByTest(workouts)

        response.body.workouts = result
        res.send(response)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/get-workout/:userID/:tokenID/:year/:month/:day', async (req, res) => {
    try {

        let response = {
            validationErrors: {},
            body: {}
        }

        const user = await User.findById(req.params.userID)

        if(user === undefined) response.validationErrors.user = 'There is no such user'
        if(user !== undefined && user.tokenID !== req.params.tokenID) response.validationErrors.user = 'Token is not valid anymore'

        if(Object.keys(response.validationErrors).length !== 0) return res.send(response)

        const workout = await Calendar.findOne({
            userID: req.params.userID,
            year: req.params.year,
            month: req.params.month,
            day: req.params.day,
        }).lean() // lean() converts MongooseDocument into plain JS object, otherwise you can't add new properties to it

        if(workout) {
            await Promise.all(workout.exercise.map(async (item, index) => {
                exercise = await Exercise.findById(workout.exercise[index].exerciseID)
                workout.exercise[index].exerciseName = exercise?.name // exercise.name can be null in the case when an exercise was deleted
            }))
            workout.uom = uom
        }


        response.body.workout = workout
        res.send(response)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = router




