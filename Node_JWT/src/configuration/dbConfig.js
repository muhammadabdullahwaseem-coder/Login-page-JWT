const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.Mongo_db_URI;

mongoose.connect(mongoUri, {
     serverSelectionTimeoutMS: 5000,
})
mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

module.exports = mongoose;
