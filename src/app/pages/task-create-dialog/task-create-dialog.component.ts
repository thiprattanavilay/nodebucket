/*============================================
; Title: task-create-dialog.component.ts
; Author: Adam Donner
; Date: 12 December 2019
; Description:  task-create-dialog.component.ts
;===========================================
*/


// start program

import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-task-create-dialog',
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.css']
})
export class TaskCreateDialogComponent implements OnInit {
  form: FormGroup;


  constructor(private dialogRef: MatDialogRef<TaskCreateDialogComponent>, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      text: [null, Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }
  /**
   * Submit form contents.
   */
  submit() {
    this.dialogRef.close(this.form.value);
  }

  /**
   * Close dialog.
   */
  close() {
    this.dialogRef.close();
  }

}

// end program