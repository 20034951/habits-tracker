const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
    serverSelectionTimeoutMS: 5000, // Prevents long MongoDB connection delays
}).then(() => {
    console.log('Database connected')
}).catch((err) => {
    console.log('Error connecting to database');
    console.log(err);
});

module.exports = mongoose;