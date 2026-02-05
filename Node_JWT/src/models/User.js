const mongoose = require('../configuration/dbConfig');


const userSchema = new mongoose.Schema({ 
   name:String,
   email:String,    
    password:String,
    role: {type: String, enum:['admin', 'customer'], default: 'user'},

})
module.exports = mongoose.model('user', userSchema);