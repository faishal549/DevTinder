const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user");
const userRouter = express.Router()

const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"]

userRouter.get("/user/request/received", authMiddleware, async (req, res) => {
    try {
        //** user should be loggedin  
        // ** recived only interested request 
        // ** valid user id request 
        // *** either accept or reject  */

        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"])

        res.status(200).json({ message: "data fetched Successfully", data: connectionRequest })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


userRouter.get("/user/connections", authMiddleware, async (req, res) => {

    try {

        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find(
            {
                $or: [{ fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }]
            }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })


        res.status(200).json({
            message: "connections fetched",
            data: data
        })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }


})

userRouter.get("/feed", authMiddleware, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = req.query.page || 1
        let limit = req.query.limit || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        })

        const hideUserFromFeed = new Set()
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })

        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName age photoUrl about skills gender").skip(skip).limit(limit)

        res.status(200).json(user)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})



module.exports = userRouter;