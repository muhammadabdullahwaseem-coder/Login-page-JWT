const User = require('../models/User');
const bcrypt = require('bcrypt');

async function CrateAdminAccount() {

try {
    const existingAdmin = await User.findOne({email: 'admin@test.com'});
    if (existingAdmin) {
        console.log('Admin account already exists');
        return;
    }
    const hashPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
        name: 'Admin',
        email: 'admin@test.com' ,
        password: hashPassword,
        role: 'admin'
    });
    const savedAdmin = await admin.save();
    console.log('Admin account created successfully', savedAdmin);

    
} catch (error) {
    console.log(error.message)
    
}




}

module.exports = CrateAdminAccount;