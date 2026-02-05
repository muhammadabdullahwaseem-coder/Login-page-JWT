const User = require('../models/User');

const bcrypt = require('bcrypt');


async function crateUser(req, res) {

    try {
        const {name,email,password} = req.body;
     const hashPassword =  await bcrypt.hash(password,10)

      const newUser =  new User({
            name,
            email,
            password: hashPassword ,
            role: 'customer'

     });

      const savedUser = await newUser.save()
        res.status(201).json({message: 'User created successfully', user: savedUser})
         console.log(savedUser)
    } 
    catch(error) {
   res.status(500).json({message: error.message})
    }

}

module.exports = {crateUser};