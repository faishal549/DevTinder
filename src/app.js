require('dotenv').config()
const express = require("express")
const ConnectDB = require("./config/database")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const cookieParser = require('cookie-parser')
const userRouter = require("./routes/user")
const cors = require('cors')
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)








ConnectDB().then(() => {
    console.log("Database connected Successfully!!")

    app.listen(process.env.PORT, () => {
        console.log("server is listening at port no : 7777...")
    })
}).catch(() => {
    console.error("Database not connected someting went wrong")
})




