import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DoctorDetailsComponent } from './doctor-details.component';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';
import { TaskService, Task } from '../../../core/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

describe('DoctorDetailsComponent', () => {
  let component: DoctorDetailsComponent;
  let fixture: ComponentFixture<DoctorDetailsComponent>;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const doctorId = 1;
  const doctorData: Doctor = {
    id: doctorId,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
  };
  const tasksData: Task[] = [
    { userId: doctorId, id: 1, title: 'Task 1', completed: false },
    { userId: doctorId, id: 2, title: 'Task 2', completed: true },
  ];

  beforeEach(async () => {
    const doctorSpy = jasmine.createSpyObj('DoctorService', ['getDoctorById']);
    const taskSpy = jasmine.createSpyObj('TaskService', ['getTasksByDoctorId']);

    await TestBed.configureTestingModule({
      imports: [DoctorDetailsComponent], // Standalone component should be imported
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => doctorId.toString() } },
          },
        },
        { provide: DoctorService, useValue: doctorSpy },
        { provide: TaskService, useValue: taskSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDetailsComponent);
    component = fixture.componentInstance;
    doctorServiceSpy = TestBed.inject(DoctorService) as jasmine.SpyObj<DoctorService>;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

    doctorServiceSpy.getDoctorById.and.returnValue(of(doctorData));
    taskServiceSpy.getTasksByDoctorId.and.returnValue(of(tasksData));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load doctor details and tasks after initialization', fakeAsync(() => {
    fixture.detectChanges(); // Trigger ngOnInit
    tick(); // Wait for async data loading
    fixture.detectChanges(); // Update the DOM after data is loaded

    const nameElement = fixture.debugElement.query(By.css('dd:nth-of-type(1)'));
    expect(nameElement).withContext('Name element should be present').toBeTruthy();
    if (nameElement) {
      expect(nameElement.nativeElement.textContent).toContain('John Doe');
    }
  }));

  it('should handle error if doctor details loading fails', fakeAsync(() => {
    doctorServiceSpy.getDoctorById.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }))
    );
    fixture.detectChanges(); // Trigger ngOnInit
    tick(); // Wait for async error response

    expect(component.errorMessages).toBe('Error loading doctor details');
  }));

  it('should handle error if tasks loading fails', fakeAsync(() => {
    doctorServiceSpy.getDoctorById.and.returnValue(of(doctorData));
    taskServiceSpy.getTasksByDoctorId.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }))
    );
    fixture.detectChanges();
    tick();

    expect(component.doctor).toEqual(doctorData);
    expect(component.errorMessages).toBe('Failed to load tasks');
  }));

  it('should update task completion status', fakeAsync(() => {
    doctorServiceSpy.getDoctorById.and.returnValue(of(doctorData));
    taskServiceSpy.getTasksByDoctorId.and.returnValue(of(tasksData));
    fixture.detectChanges();
    tick();

    component.tasks[0].completed = true;
    fixture.detectChanges();

    const taskCheckbox = fixture.debugElement.query(By.css('ul li input'));
    expect(taskCheckbox.nativeElement.checked).toBeTrue();
  }));
});
