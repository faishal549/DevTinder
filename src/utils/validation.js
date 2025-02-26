
const validateSignup = (req) => {

    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required!!")
    }
}

const validateProfileEdit = (req) => {

    const Updates_Allowed = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]

    const isUpdateAllowed = Object.keys(req.body).every((field) => Updates_Allowed.includes(field))



    return isUpdateAllowed
}


module.exports = { validateSignup, validateProfileEdit }