import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DoctorDetailsComponent } from './doctor-details.component';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';
import { TaskService, Task } from '../../../core/services/task.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

describe('DoctorDetailsComponent', () => {
  let component: DoctorDetailsComponent;
  let fixture: ComponentFixture<DoctorDetailsComponent>;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

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
    const taskSpy = jasmine.createSpyObj('TaskService', [
      'getTasksByDoctorId',
      'updateTask',
    ]);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [DoctorDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => doctorId.toString() } },
          },
        },
        { provide: DoctorService, useValue: doctorSpy },
        { provide: TaskService, useValue: taskSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDetailsComponent);
    component = fixture.componentInstance;
    doctorServiceSpy = TestBed.inject(
      DoctorService
    ) as jasmine.SpyObj<DoctorService>;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;

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
    expect(nameElement.nativeElement.textContent).toContain('John Doe');

    expect(notificationServiceSpy.addNotification).toHaveBeenCalledWith(
      'Doctor details loaded successfully',
      'success'
    );
  }));
});
