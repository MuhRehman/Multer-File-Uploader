const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rehman:rehman123@cluster0.s9oi5.mongodb.net/testing?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});


require('./employee.model');