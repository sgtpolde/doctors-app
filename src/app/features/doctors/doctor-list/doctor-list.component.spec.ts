import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DoctorListComponent } from './doctor-list.component';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';
import { of, throwError } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('DoctorListComponent', () => {
  let component: DoctorListComponent;
  let fixture: ComponentFixture<DoctorListComponent>;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;

  const dummyDoctors: Doctor[] = [
    { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com' },
    { id: 3, name: 'Alice Johnson', username: 'alicej', email: 'alice@example.com' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DoctorService', [
      'getDoctors',
      'deleteDoctor',
    ]);

    await TestBed.configureTestingModule({
      imports: [DoctorListComponent, RouterModule.forRoot([]), FormsModule],
      providers: [{ provide: DoctorService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorListComponent);
    component = fixture.componentInstance;
    doctorServiceSpy = TestBed.inject(DoctorService) as jasmine.SpyObj<DoctorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display doctors after initialization', fakeAsync(() => {
    doctorServiceSpy.getDoctors.and.returnValue(of(dummyDoctors));
    fixture.detectChanges(); // Initial ngOnInit call
    tick(); // Resolve async operations

    expect(component.doctors.length).toBe(3);
    expect(component.filteredDoctors.length).toBe(3);
    fixture.detectChanges(); // Trigger view update

    const doctorRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(doctorRows.length).toBe(3);
  }));

  it('should filter doctors based on search input', fakeAsync(() => {
    doctorServiceSpy.getDoctors.and.returnValue(of(dummyDoctors));
    fixture.detectChanges();
    tick();

    component.filterText = 'Jane';
    component.filterDoctors();
    fixture.detectChanges();

    expect(component.filteredDoctors.length).toBe(1);
    expect(component.filteredDoctors[0].name).toBe('Jane Smith');

    const doctorRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(doctorRows.length).toBe(1);
    expect(doctorRows[0].nativeElement.textContent).toContain('Jane Smith');
  }));

  it('should sort doctors by name', fakeAsync(() => {
    doctorServiceSpy.getDoctors.and.returnValue(of(dummyDoctors));
    fixture.detectChanges();
    tick();

    component.sortDoctors('name', false);
    fixture.detectChanges();

    expect(component.filteredDoctors[0].name).toBe('Alice Johnson');
    expect(component.filteredDoctors[1].name).toBe('Jane Smith');
    expect(component.filteredDoctors[2].name).toBe('John Doe');
  }));

  it('should delete a doctor', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog
    doctorServiceSpy.getDoctors.and.returnValue(of(dummyDoctors));
    doctorServiceSpy.deleteDoctor.and.returnValue(of(undefined));
    fixture.detectChanges();
    tick();

    component.deleteDoctor(1);
    tick();

    expect(doctorServiceSpy.deleteDoctor).toHaveBeenCalledWith(1);
    expect(component.doctors.length).toBe(2);
    expect(component.filteredDoctors.length).toBe(2);
    fixture.detectChanges(); // Update the view after deletion

    const doctorRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(doctorRows.length).toBe(2);
  }));
  
});
