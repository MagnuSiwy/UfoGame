import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  //providers: [LoginService]
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) { }

  username: string = '';
  email: string = '';
  password: string = '';
  repPassword: string = '';
  usernameExists: boolean = true;
  validPassword: boolean = false;
  validEmail: boolean = false;

  OnClick()
  {
    interface Data {
      username: string;
      email: string;
      password: string;
    }

    let username: string = this.username;
    let email: string = this.email;
    let password: string = this.password;

    if (!this.validPassword || !this.validEmail || this.usernameExists)
    {
      alert("Wrong username, email or password");
      return;
    }

    const url = "http://wd.etsisi.upm.es:10000/users";

    this.http.post<Data>(url, { username: username, email: email, password: password }).subscribe({
      next: data => {
        alert("You can now log in");
        this.router.navigate(['/login']);
      },
      error: error => {
        alert("Something went wrong");
      }
    })
  }

  checkUsername()
  {
    const url = 'http://wd.etsisi.upm.es:10000/users/' + this.username;
    this.http.get<any>(url).subscribe({
      next: data => {
        document.getElementById("checkUsername")!.style.display = "inline";
      },
      error: error => {
        if (error.status == 404) {
          if(this.username.length > 0) {
            this.usernameExists = false;
            document.getElementById("checkUsername")!.style.display = "none";
          }
        }
        else {
          console.log(error);
        }
      }
    });
  }

  checkEmail() {
    if (!(document.getElementById("email")! as HTMLInputElement).validity.valid) {
      document.getElementById("checkEmail")!.style.display = "inline";
      this.validEmail = false;
    }
    else {
      document.getElementById("checkEmail")!.style.display = "none";
      this.validEmail = true;
    }
  }

  checkPassword()
  {
    if(this.password != this.repPassword || this.password.length < 1)
    {
      document.getElementById("checkPassword")!.style.display = "inline";
      this.validPassword = false;
    }
    else
    {
      document.getElementById("checkPassword")!.style.display = "none";
      this.validPassword = true;
    }
  }
}
