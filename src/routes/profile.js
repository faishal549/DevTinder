const express = require('express')
const profileRouter = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const { validateProfileEdit } = require("../utils/validation")
const User = require("../Models/user")


profileRouter.get("/profile", authMiddleware, (req, res) => {
    try {
        const user = req.user
        res.json({ data: user })

    } catch (error) {
        res.status(500).json({ message: "ERROR:" + error.message })
    }
})

profileRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
    try {
        const userDetails = req.body
        const user = req.user
        const userId = user._id
        if (!validateProfileEdit(req)) {
            throw new Error("Update request is Invalid")
        }
        if (userDetails?.skills.length > 20) {
            throw new Error("You can maximum add 20 skills")
        }


        const updateUser = await User.findByIdAndUpdate({ _id: userId }, userDetails, { new: true })

        res.status(200).json({ UpdatedDetails: updateUser })


    } catch (error) {
        res.status(400).json({ message: "ERROR:" + error.message })
    }
})


module.exports = profileRouter;