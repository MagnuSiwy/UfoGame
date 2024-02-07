import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {

  constructor (private http: HttpClient, private router: Router, private loginService: LoginService) {}

  checkPassword(password: string, repPassword: string)
  {
    if(password != repPassword || password.length < 1)
    {
      document.getElementById("checkPassword")!.style.display = "inline";
      return false;
    }
    else
    {
      document.getElementById("checkPassword")!.style.display = "none";
      return true;
    }
  }

  sendNewPassword(newPassword: string)
  {
    const url = "http://wd.etsisi.upm.es:10000/users";

    this.http.patch(`${url}/${localStorage.getItem("Username")}`, { password: newPassword }, { headers: { 'Authorization': localStorage.getItem("LoginToken")! } }).subscribe({
      next: data => {
        alert("Password has been changed");
      },
      error: error => {
        alert("Something went wrong");
        this.loginService.logout();
      }
    })
    this.router.navigate(['/home']);
  }
}
