// start program

/**
 * Require statements
 */
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Employee = require('./db-models/employee');

/**
 * App configurations
 */
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

/**
 * Variables
 */
const port = process.env.PORT || 3000; // server port

// Mongodb connection string
const conn = 'mongodb+srv://admin:admin@cluster0-yv85y.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection
 */
mongoose.connect(conn, {
  promiseLibrary: require('bluebird'),
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
}).then(() => {
  console.debug(`Connection to the database instance was successful`);
}).catch(err => {
  console.log(`MongoDB Error: ${err.message}`)
}); // end mongoose connection

/**
 * API(s)
 */

 /**
  * FindEmployeeById
  */

app.get('/api/employees/:empId', function(req, res, next) {
  Employee.findOne({'empId': req.params.empId}, function(err, employee){
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(employee);
      res.json(employee);
    }
  })
});

/**
 * FindAllTasks
 */
app.get('/api/employees/:empId/tasks', function(req, res, next) {
  /**
   * Find all tasks based on employee ID and return only todo and done
   */

  Employee.findOne({'empId': req.params.empId}, 'empId todo done', function(err, tasks) {

    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(tasks);
      res.json(tasks);
    }
  })
});

/**
 * CreateTask
 */
app.post('/api/employees/:empId/tasks', function(req, res, next) {
  Employee.findOne({'empId': req.params.empId}, function(err, employee) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(err);

      const task = {
        text: req.body.text
      };

        /**
         * Push todo into task array
         */
      employee.todo.push(task);
      employee.save(function(err, employee) {
        if (err) {
          console.log(err);
          return next(err);
        } else {
          console.log(employee);
          res.json(employee);
        }
      })
    }
  })
});

/**
 * Update Task
 */

app.put('/api/employees/:empId/tasks', function(req, res, next) {
  Employee.findOne({'empId': req.params.empId}, function(err, employee) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(employee);

      /**
       * Set employee todo and done
       */
      employee.set({
        todo: req.body.todo,
        done: req.body.done
      });

      /**
       * Save record
       */
      employee.save(function(err, employee) {
        if (err) {
          console.log(err);
          return next(err);
        } else {
          console.log(employee);
          res.json(employee);
        }
      })
    }
  })
});

/**
 * DeleteTask
 */
app.delete('/api/employees/:empId/tasks/:taskId', function(req, res, next) {
  Employee.findOne({'empId': req.params.empId}, function(err, employee) {
    if (err) {
      console.log (err);
      return next (err);
    } else {
      console.log(employee);

      const todoItem = employee.todo.find(item => item._id.toString() === req.params.taskId);
      const doneItem = employee.done.find(item => item._id.toString() === req.params.taskId);

      /**
       * If todo item is true, remove item and save record.
       */
      if (todoItem) {
        employee.todo.id(todoItem._id).remove();
        employee.save(function(err, emp1) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            console.log(emp1);
            res.json(emp1);
          }
        })
        /**
         * If done item is true, remove item and save record
         */
      } else if (doneItem) {
        employee.done.id(doneItem._id).remove();
        employee.save(function(err, emp2) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            console.log(emp2);
            res.json(emp2);
          }
        })
      }
      /**
       * Else both todo and done are null, return an error code and message
       */
      else {
        console.log(`Unable to locate task: ${req.params.taskId}`)
        res.status(200).send({
          'type': 'warning',
          'text': `Unable to locate task: ${req.params.taskId}`
        })
      }
    }
  })
});

/**
 * Create and start server
 */
http.createServer(app).listen(port, function() {
  console.log(`Application started and listening on port: ${port}`)
}); // end http create server function

// end program
