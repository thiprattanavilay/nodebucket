import {Routes} from '@angular/router';
import {BaseLayoutComponent} from './shared/base-layout/base-layout.component';
import {HomeComponent} from './pages/home/home.component';
import { SigninComponent } from './pages/signin/signin.component';
import { AuthGuard } from './shared/guards/auth.guard';



export const AppRoutes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]

      },
      {
        path: '',
        component: SigninComponent,
      }
      /*
        New components go here...
       */
    ]
  }
];
