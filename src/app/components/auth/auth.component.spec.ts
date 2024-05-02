import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { AuthComponent } from './auth.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, MatCardModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule], // Include MatCardModule
      providers: [{ provide: AuthService, useValue: authServiceSpyObj }]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm on ngOnInit', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm?.get('email')).toBeDefined();
    expect(component.loginForm?.get('password')).toBeDefined();
  });


  it('should call login method on form submission', () => {
    const loginSpy = authServiceSpy.login.and.returnValue(of(true)); // Mock the login method to return an Observable

    component.loginForm?.setValue({ email: 'test@example.com', password: 'password' });
    component.login();

    expect(loginSpy).toHaveBeenCalled();
  });

  it('should call socialLogin method with provider on social button click', () => {
    const loginSpy = authServiceSpy.login.and.returnValue(of(true)); // Mock the login method to return an Observable
    // Arrange
    const provider = 'google';

    // Act
    component.socialLogin(provider);

    // Assert
    expect(loginSpy).toHaveBeenCalled();
  });
});
