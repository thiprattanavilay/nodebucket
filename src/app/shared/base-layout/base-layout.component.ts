// start program

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {
  year: number = Date.now();


  constructor(private cookieService: CookieService, private router: Router) {

  }



  ngOnInit() {
  }
  /**
   * Delete cookie and redirect to signin page.
   */
  logout() {

    this.cookieService.delete('session_user');
    this.router.navigate(['/session/signin']);



  }

}
// end program
