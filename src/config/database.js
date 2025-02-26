const mongoose = require('mongoose')
const URL = process.env.DB_URI
const ConnectDB = async () => {

    await mongoose.connect(URL)

}


module.exports = ConnectDB