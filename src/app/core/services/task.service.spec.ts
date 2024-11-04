import { TestBed } from '@angular/core/testing';
import { TaskService, Task } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const dummyTasks: Task[] = [
    { userId: 1, id: 1, title: 'Task 1', completed: false },
    { userId: 1, id: 2, title: 'Task 2', completed: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve tasks by doctor ID via GET', () => {
    const doctorId = 1;
    service.getTasksByDoctorId(doctorId).subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/users/${doctorId}/todos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  // Additional tests for addTask, updateTask, deleteTask, and error handling can be added similarly
});
