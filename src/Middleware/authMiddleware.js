const jwt = require('jsonwebtoken')
const User = require("../Models/user")
const authMiddleware = async (req, res, next) => {

    try {
        const token = req.cookies.token
        if (!token) {
            throw new Error("Token is not found !!")
        }

        //**verify Token */
        const verifiedToken = jwt.verify(token, process.env.SECRECT_TOKEN_KEY)
        if (!verifiedToken) {
            throw new Error("Unauthorized Token")
        }
        const user = await User.findById(verifiedToken.id)

        req.user = user
        next()
    } catch (error) {
        res.status(500).send("ERROR:" + error.message)
    }


}

module.exports = authMiddleware