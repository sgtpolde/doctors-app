import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DoctorFormComponent } from './doctor-form.component';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('DoctorFormComponent', () => {
  let component: DoctorFormComponent;
  let fixture: ComponentFixture<DoctorFormComponent>;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const doctorSpy = jasmine.createSpyObj('DoctorService', [
      'getDoctorById',
      'addDoctor',
      'updateDoctor',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DoctorFormComponent, FormsModule],
      providers: [
        { provide: DoctorService, useValue: doctorSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }, // Simulate 'add' mode
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorFormComponent);
    component = fixture.componentInstance;
    doctorServiceSpy = TestBed.inject(
      DoctorService
    ) as jasmine.SpyObj<DoctorService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create in add mode', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
  });

  it('should create in edit mode and load doctor data', fakeAsync(() => {
    const doctorId = 1;
    const doctorData: Doctor = {
      id: doctorId,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
    };
  
    // Reset TestBed and reconfigure
    TestBed.resetTestingModule();
    const doctorSpy = jasmine.createSpyObj('DoctorService', [
      'getDoctorById',
      'addDoctor',
      'updateDoctor',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
  
    TestBed.configureTestingModule({
      imports: [DoctorFormComponent, FormsModule],
      providers: [
        { provide: DoctorService, useValue: doctorSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => doctorId.toString() } } },
        },
      ],
    }).compileComponents();
  
    doctorServiceSpy = TestBed.inject(DoctorService) as jasmine.SpyObj<DoctorService>;
    doctorServiceSpy.getDoctorById.and.returnValue(of(doctorData));
  
    fixture = TestBed.createComponent(DoctorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
  
    expect(component.isEditMode).toBeTrue();
    expect(component.doctor).toEqual(doctorData);
  }));
  

  it('should submit form and add doctor', fakeAsync(() => {
    const newDoctor: Doctor = {
      id: 0,
      name: 'Alice',
      username: 'alice',
      email: 'alice@example.com',
    };

    doctorServiceSpy.addDoctor.and.returnValue(of(newDoctor));
    component.doctor = newDoctor;
    component.isEditMode = false;

    component.onSubmit();
    tick();

    expect(doctorServiceSpy.addDoctor).toHaveBeenCalledWith(newDoctor);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/doctors']);
  }));

  it('should submit form and update doctor', fakeAsync(() => {
    const updatedDoctor: Doctor = {
      id: 1,
      name: 'Bob',
      username: 'bob',
      email: 'bob@example.com',
    };

    doctorServiceSpy.updateDoctor.and.returnValue(of(updatedDoctor));
    component.doctor = updatedDoctor;
    component.isEditMode = true;

    component.onSubmit();
    tick();

    expect(doctorServiceSpy.updateDoctor).toHaveBeenCalledWith(updatedDoctor);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/doctors']);
  }));

  it('should handle error on form submission', fakeAsync(() => {
    const doctor: Doctor = {
      id: 0,
      name: 'Error',
      username: 'error',
      email: 'error@example.com',
    };

    doctorServiceSpy.addDoctor.and.returnValue(
      throwError(() => new Error('Add error'))
    );
    component.doctor = doctor;
    component.isEditMode = false;

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe('Add error');
  }));
});
