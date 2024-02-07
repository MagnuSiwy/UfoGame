import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginTimeout: number = 0;
  timePid: any = 0;

  startService() 
  {
    this.timePid = setInterval(() => this.loginTimer(), 1000);
  }

  loginTimeoutRenewal()
  {
    this.loginTimeout = 600;
  }

  loginTimer()
  {
    if (this.isLoggedIn() && localStorage.getItem("LoginToken") != null)
    {
      this.loginTimeout--;
      //console.log(this.loginTimeout);
    }
    else if (localStorage.getItem("LoginToken") != null)
    {
      this.logout();
    }
  }

  logout(status: number = 0)
  {
    localStorage.removeItem("LoginToken");;
    localStorage.removeItem("Username");
    this.loginTimeout = 0;
    if (status == 401) {
      alert("Your session has been ended.");
    }
  }

  isLoggedIn(): boolean
  {
    if(this.loginTimeout > 0)
    {
      return true;
    }

    return false
  }
}
