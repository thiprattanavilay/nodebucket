// start program

const mongoose = require('mongoose');
const Task = require('./task')

/**
 * Declare employee database schema
 */
let employeeSchema = mongoose.Schema({
    empId:     {type: String, unique: true, dropDups: true},
    firstname: {type: String},
    lastname:  {type: String},
    todo:      [Task],
    doing:     [Task],
    done:      [Task]
});

// Export mongoose model

module.exports = mongoose.model('Employee', employeeSchema);

// end program
