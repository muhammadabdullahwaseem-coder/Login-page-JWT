

const bcrypt = require("bcrypt")
const User = require("../models/User")
const { generateToken} = require("../utils/jwtUtils")


async function login(req,res) {

try{

    const {email,password} = req.body;
    
    const existinguser = await User.findOne({email})
    if(!existinguser){
        throw new error("user not found")
    }
     const isPasswordValid =await bcrypt.compare(password, existinguser.password)
     if(!isPasswordValid){
        throw new error("incorrect pw")
     }
     const token = generateToken(existinguser)
     res.status(200).json({message: "Login successfull" , token:token , user:existinguser})


    }




catch(error){
    console.log(error.message)
res.status(401).json({message: "invalid credentials"});

}


}

module.exports = {login}