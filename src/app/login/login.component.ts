import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  //providers: [LoginService]
})
export class LoginComponent {
  constructor(private loginService: LoginService, private http: HttpClient, private router: Router) { }

  username: string = '';
  password: string = '';

  userRequest() {
    const url = `http://wd.etsisi.upm.es:10000/users/login?username=${this.username}&password=${this.password}`;

    this.http.get(url).subscribe({
      next: data => {
        localStorage.setItem("LoginToken", data.toString());
        localStorage.setItem("Username", this.username);
        this.loginService.loginTimeoutRenewal();
        this.router.navigate(['/home']);
      },
      error: error => {
        this.loginService.logout();
        alert('Invalid username or password');
      } 
    })
  }
}
