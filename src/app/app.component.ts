import { Component } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [LoginService]
})
export class AppComponent {
  constructor(private loginService: LoginService) { }

  title = 'ufoGame';

  ngOnInit()
  {
    this.loginService.startService();
  }
}
