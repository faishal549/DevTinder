const express = require('express')
const User = require("../Models/user")
const { validateSignup } = require('../utils/validation')
const bcrypt = require('bcrypt')
const authRouter = express.Router()


//**Singnup API */

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body
        //**Validating signup feilds */
        validateSignup(req)

        //**Password Encryption */

        const hashPaasword = await bcrypt.hash(password, 10)
        await User.create({ firstName, lastName, emailId, password: hashPaasword })
        res.status(200).json({ message: "New user added successfully!!" })
    } catch (error) {
        res.status(400).json({ message: "ERROR:" + error.message })
    }
})

//**Login API */

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        //**check email */
        const isEmailExist = await User.findOne({ emailId: emailId })
        if (!isEmailExist) {
            throw new Error("Invalid Credentials")
        }
        //**Verifiy the password */

        const isPasswordCorrect = await isEmailExist.checkPassword(password)

        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid Credentials" })
        } else {
            const token = await isEmailExist.generateToken()

            res.cookie("token", token, { expires: new Date(Date.now() + 3600000) })
            res.status(200).json({ message: "Login successful !!" })
        }

    } catch (error) {
        res.status(500).send({ message: "ERROR:" + error.message })

    }
})

//**Logout API */

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) })

    res.status(200).json({ message: "Logout successfully !!" })
})

module.exports = authRouter;