const Cryptr = require('cryptr')
const userService = require('../user/user.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}

async function login(username) {

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username')

    user._id = user._id.toString()
    return user
}

async function signup({ username }) {
    // const saltRounds = 10

    // logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username) return Promise.reject('Missing required signup information')

    const userExist = await userService.getByUsername(username)
    if (userExist) return Promise.reject('Username is already taken')

    return userService.add({ username })
}

function getLoginToken(user) {
    const userInfo = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

