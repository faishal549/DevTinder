require('dotenv').config()
const express = require("express")
const ConnectDB = require("./config/database")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const cookieParser = require('cookie-parser')
const userRouter = require("./routes/user")
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)







ConnectDB().then(() => {
    console.log("Database connected Successfully!!")

    app.listen(7777, () => {
        console.log("server is listening at port no : 7777...")
    })
}).catch(() => {
    console.error("Database not connected someting went wrong")
})




