const { Schema, model } = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 25,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error("Email id is not valid" + value)
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password does not meet the requirement")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate: (value) => {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Please select correct Gender")
            }
        }
    },
    photoUrl: {
        type: String,
        default: process.env.DEFAULT_PHOTO_URL
    },
    about: {
        type: String,
        maxLength: 100,
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

//**verify hashPassword */

userSchema.methods.checkPassword = async function (password) {
    const user = this;
    const verifiedHashPassword = bcrypt.compare(password, this.password)
    return verifiedHashPassword

}

//**Generate Token */
userSchema.methods.generateToken = async function () {
    try {
        const user = this
        const jwtToken = jwt.sign({ id: this._id.toString() }, process.env.SECRECT_TOKEN_KEY, { expiresIn: "1d" })
        return jwtToken

    } catch (error) {
        res.status(500).send("Error while generating token")
    }

}

module.exports = model("User", userSchema)