/*============================================
; Title: signin.component.ts
; Author: Adam Donner
; Date: 30 November 2019
; Description:  signin.component.ts
;===========================================
*/


// start program

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;

  constructor(private router: Router, private cookieService: CookieService, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.form = this.fb.group({
      empId: [null, Validators.compose([Validators.required])]
    });
  }
  /**
   * Login function.
   * Tests login calling API from server.
   */
  login() {
    const empId = this.form.controls['empId'].value;
    console.log(empId);
    // Call API
    this.http.get('/api/employees/' + empId).subscribe(res => {
      /**
       * If true redirect to home page.
       */
      if (res) {
        this.cookieService.set('session_user', empId, 1);
        this.router.navigate(['/']);
      } 
      /**
       * Else display error message
       */
      else {
        this.errorMessage = 'The Employee ID you entered is not found, please try again.';
      }
    });
  }
}

// end program