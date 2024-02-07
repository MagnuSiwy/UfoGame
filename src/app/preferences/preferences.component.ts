import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {
  ufoCount: number = 1;
  time: number = 60;

  ngOnInit() {
    this.loadLocalStorage();
  }

  setVariables() {
    localStorage.setItem('time', JSON.stringify(this.time));
    localStorage.setItem('ufoCount', this.ufoCount.toString());
  }

  updateSeconds(seconds: number) {
    this.time = seconds;
  }

  loadLocalStorage() {
    this.ufoCount = parseInt(localStorage.getItem('ufoCount') || '1');
    this.time = parseInt(localStorage.getItem('time') || '60');
  }
}