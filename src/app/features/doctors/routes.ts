import { Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';


export const doctorRoutes: Routes = [
  { path: '', component: DoctorListComponent },
  { path: ':id', component: DoctorDetailsComponent },
];
