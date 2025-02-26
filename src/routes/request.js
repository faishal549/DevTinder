const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware');
const ConnectionRequest = require('../Models/connectionRequest');
const User = require('../Models/user');
const requestRouter = express.Router()



requestRouter.post("/request/send/:status/:userId", authMiddleware, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status


        //**validate to allowed request status */
        const AllowedStatus = ["interested", "ignored"]
        if (!AllowedStatus.includes(status)) {
            return res.status(404).json({ message: "Request status is not valid" })
        }

        const checkToUserId = await User.findById(toUserId)
        if (!checkToUserId) {
            return res.status(404).json({ message: "Invalid request user id " })
        }


        //** Here i am handling if same user send req to other user again and other user who already requested 
        // ** can not send request to same person   */
        const existingConnnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnnectionRequest) {
            return res.status(404).json({ message: "Requested action already exist" })
        }


        //** creating new instance of model */
        const createNewConnectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })

        await createNewConnectionRequest.save()

        res.status(200).json({ message: " Request status is send as " + status })


    } catch (error) {
        res.status(400).send("ERROR:" + error.message)
    }
})

requestRouter.post("/request/review/:status/:userId", authMiddleware, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { status, userId } = req.params

        const AllowedStatus = ["accepted", "rejected"]
        if (!AllowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId: userId,
            toUserId: loggedInUser._id,
            status: "interested"

        })
        if (!connectionRequest) {
            res.status(400).json({ message: "Invalid request made" })
        }
        connectionRequest.status = status
        await connectionRequest.save()
        res.status(200).json({ message: "Request has been" + status })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = requestRouter;