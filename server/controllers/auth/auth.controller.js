const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')

//register
// req is data gotten from body
// res is data we send back to client
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body

  try {
    //check if user exists

    const checkUser = await User.findOne({ email })
    if (checkUser)
      return res.json({
        success: false,
        message: 'User Already exists with the same email!',
      })
    const hashPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    })
    await newUser.save()
    // send a message
    res.status(200).json({
      success: true,
      message: 'Registration successful',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const checkUser = await User.findOne({ email })
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      })
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    )
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: 'Incorrect password! Please try again',
      })
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      'CLIENT_SECRET_KEY',
      { expiresIn: '60mins' }
    )
    res.cookie('token', token, { httpOnly: true, secure: true }).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    })

    //if we don't have any hosting issue,avoid the code below
    // res.status(200).json({
    //   success: true,
    //   message: 'Logged in successfully',
    //   token,
    //   user: {
    //     email: checkUser.email,
    //     role: checkUser.role,
    //     id: checkUser._id,
    //     userName: checkUser.userName,
    //   },
    // })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    })
  }
}
//logout
const logoutUser = (req, res) => {
  res.clearCookie('token').json({
    success: true,
    message: 'Logged out successfully!',
  })
}

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token
  //if we don't have any hosting error avoid this code base below
  // const authHeader = req.header['authorization']
  // const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user!',
    })

  try {
    const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized user!',
    })
  }
}

// logOut & authMiddleware might not be used if we run redux persist on the frontend

module.exports = { registerUser, loginUser, logoutUser, authMiddleware }
