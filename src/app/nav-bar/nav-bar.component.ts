import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private loginService: LoginService) { }

  pid: any = 0;

  ngOnInit() 
  {
    this.pid = setInterval(() => this.logoutButton(this.loginService.isLoggedIn()), 1000);
  }

  logout()
  {
    this.loginService.logout(401);
  }

  logoutButton(loggedIn: boolean)
  {
    if(loggedIn)
    {
      document.getElementById("register")!.style.display = "none";
      document.getElementById("login")!.style.display = "none";
      document.getElementById("logout")!.style.display = "inline";
      document.getElementById("profile")!.style.display = "inline";
    }
    else
    {
      document.getElementById("register")!.style.display = "inline";
      document.getElementById("login")!.style.display = "inline";
      document.getElementById("logout")!.style.display = "none";
      document.getElementById("profile")!.style.display = "none";
    }
  }
}
