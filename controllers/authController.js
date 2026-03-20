const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signup = async (req, res) => {
    try {
        const {username, password} = req.body
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({username, password: hashpassword})
        console.log(req.session)
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch(e) {
        res.status(400).json({status: "fail"})
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if(!user) {
            return res.status(404).json({
                status: "fail",
                message: 'user not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if(isCorrect) {
            req.session.user = user;
            return res.status(201).json({
                status: 'success'
            })
        }

        return res.status(400).json({
            status: 'fail',
            message: "credential invalid"
        })
    } catch(e) {
        res.status(400).json({status: "fail"})
    }
}