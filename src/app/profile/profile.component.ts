import { Component } from '@angular/core';
import { PasswordChangeService } from '../services/password-change.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [PasswordChangeService]
})
export class ProfileComponent {
  constructor(private prof: PasswordChangeService, private loginService: LoginService) {}

  password: string = '';
  repPassword: string = '';
  validPassword: boolean = false;

  changePassword()
  {
    this.validPassword ? this.prof.sendNewPassword(this.password) : alert("Passwords are not the same!");
  }

  checkPassword()
  {
    this.validPassword = this.prof.checkPassword(this.password, this.repPassword);
    this.validPassword ? document.getElementById("checkPassword")!.style.display = "none" : document.getElementById("checkPassword")!.style.display = "inline";
  }
}
