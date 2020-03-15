// start program

const mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    text: {type: String}
});

module.exports = taskSchema;

// end program
