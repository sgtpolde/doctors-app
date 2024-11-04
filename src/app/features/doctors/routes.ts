import { Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';


export const doctorRoutes: Routes = [
  { path: '', component: DoctorListComponent },
  { path: 'add', component: DoctorFormComponent },
  { path: 'edit/:id', component: DoctorFormComponent },
  { path: ':id', component: DoctorDetailsComponent },
];
