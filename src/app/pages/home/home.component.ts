// start program

import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskCreateDialogComponent } from '../task-create-dialog/task-create-dialog.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sessionUser: string;
  tasks: any;
  todo: any;
  doing: any;
  done: any;



  constructor(private http: HttpClient, private cookieService: CookieService, private dialog: MatDialog) {
    this.sessionUser = this.cookieService.get('session_user');

    /**
     * Get the tasks and fill both columns
     */
    this.http.get('/api/employees/' + this.sessionUser + '/tasks').subscribe(res => {
      this.tasks = res;
      this.todo = this.tasks.todo;
      this.doing = this.tasks.doing;
      this.done = this.tasks.done;
      console.log(this.tasks);
      console.log(this.todo);
      console.log(this.doing);
      console.log(this.done);
    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

  /**
   * Create task dialog box
   */
  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      disableClose: true
    });
    /**
     * Post to tasks
     */
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.http.post('/api/employees/' + this.sessionUser + '/tasks', {
          text: data.text
        }).subscribe(res => {
          this.tasks = res;
          this.todo = this.tasks.todo;
          this.doing = this.tasks.doing;
          this.done = this.tasks.done;
        }, err => {
          console.log(err);
        });
      }
    });
  }

    /**
     * Delete tasks from either array
     */
  deleteTask(taskId) {
    if (taskId) {
      console.log(`Task item: ${taskId} is being removed.`);
      this.http.delete('/api/employees/' + this.sessionUser +'/tasks/' + taskId).subscribe(res => {
        this.tasks = res;
        this.todo = this.tasks.todo;
        this.doing = this.tasks.doing;
        this.done = this.tasks.done;
      }, err => {
        console.log(err);
      })
    }
  }

  /**
   * Drag and drop between columns
   */
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateTasks(this.todo, this.doing, this.done).subscribe(res => {
        this.tasks = res;
        this.todo = this.tasks.todo;
        this.doing = this.tasks.doing;
        this.done = this.tasks.done;
      }, err => {
        console.log("Error saving update tasks");
        console.log(err);
      });
      console.log("Moved task in existing column");
      console.log(this.todo);
      console.log(this.doing);
      console.log(this.done);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.updateTasks(this.todo, this.doing, this.done).subscribe(res => {
        this.tasks = res;
        this.todo = this.tasks.todo;
        this.doing = this.tasks.doing;
        this.done = this.tasks.done;
      }, err => {
        console.log('Error saving update tasks');
        console.log(err);
      });
      console.log('Moved tasks to a new column');
      console.log(this.todo);
      console.log(this.doing);
      console.log(this.done);
    }
  }

  /**
   * update Task, used in drag and drop
   */
  updateTasks(todo, doing, done) {
    return this.http.put('/api/employees/' + this.sessionUser + '/tasks', {
      todo: todo,
      doing: doing,
      done: done,
    });
  }
}
// end program
