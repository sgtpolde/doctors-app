import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DoctorDetailsComponent } from './doctor-details.component';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';
import { TaskService, Task } from '../../../core/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

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
      imports: [DoctorDetailsComponent],
      providers: [
        { provide: DoctorService, useValue: doctorSpy },
        { provide: TaskService, useValue: taskSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => doctorId.toString() } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDetailsComponent);
    component = fixture.componentInstance;
    doctorServiceSpy = TestBed.inject(DoctorService) as jasmine.SpyObj<DoctorService>;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

    doctorServiceSpy.getDoctorById.and.returnValue(of(doctorData));
    taskServiceSpy.getTasksByDoctorId.and.returnValue(of(tasksData));
  });

  it('should create and load doctor details and tasks', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.doctor).toEqual(doctorData);
    expect(component.tasks).toEqual(tasksData);

    fixture.detectChanges();

    const doctorNameElement = fixture.debugElement.query(By.css('h2'));
    expect(doctorNameElement.nativeElement.textContent).toContain('John Doe');

    const taskItems = fixture.debugElement.queryAll(By.css('ul li'));
    expect(taskItems.length).toBe(2);
  }));
});
