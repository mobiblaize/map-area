import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm?: FormGroup;
  loginSb?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.loginSb?.unsubscribe();
  }

  login() {
    // Handle login logic
    this.loginSb = this.authService.login().subscribe({next: ()=> {
      this.router.navigateByUrl('/', {
        replaceUrl: true
      })
    }});
  }

  socialLogin(provider: string) {
    // Placeholder for social login functionality
    this.authService.login().subscribe({next: ()=> {
      this.router.navigateByUrl('/', {
        replaceUrl: true
      })
    }});
  }
}
