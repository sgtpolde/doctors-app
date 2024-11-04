import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, NavbarComponent, NotificationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null,
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'doctors-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('doctors-app');
  });
  
});
