import { TestBed } from '@angular/core/testing';
import { DoctorService, Doctor } from './doctor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DoctorService', () => {
  let service: DoctorService;
  let httpMock: HttpTestingController;

  const dummyDoctors: Doctor[] = [
    { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DoctorService],
    });
    service = TestBed.inject(DoctorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve doctors via GET', () => {
    service.getDoctors().subscribe((doctors) => {
      expect(doctors.length).toBe(2);
      expect(doctors).toEqual(dummyDoctors);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDoctors);
  });

  it('should retrieve a doctor by ID via GET', () => {
    const doctorId = 1;
    service.getDoctorById(doctorId).subscribe((doctor) => {
      expect(doctor).toEqual(dummyDoctors[0]);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${doctorId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDoctors[0]);
  });

  it('should add a new doctor via POST', () => {
    const newDoctor: Doctor = {
      id: 3,
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
    };

    service.addDoctor(newDoctor).subscribe((doctor) => {
      expect(doctor).toEqual(newDoctor);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDoctor);
    req.flush(newDoctor);
  });

  it('should update an existing doctor via PUT', () => {
    const updatedDoctor: Doctor = { ...dummyDoctors[0], name: 'Johnathan Doe' };

    service.updateDoctor(updatedDoctor).subscribe((doctor) => {
      expect(doctor).toEqual(updatedDoctor);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${updatedDoctor.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedDoctor);
    req.flush(updatedDoctor);
  });

  it('should delete a doctor via DELETE', () => {
    const doctorId = 1;

    service.deleteDoctor(doctorId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${doctorId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle errors', () => {
    const errorMessage = 'Simulated network error';

    service.getDoctors().subscribe({
      next: () => fail('Expected an error, not doctors'),
      error: (error) => expect(error.message).toContain('An error occurred'),
    });

    const req = httpMock.expectOne(service['apiUrl']);
    req.error(new ErrorEvent('Network error'), { status: 500, statusText: errorMessage });
  });
});
