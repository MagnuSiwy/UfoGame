import { HostListener } from '@angular/core';
import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  constructor(private loginService: LoginService, private http: HttpClient, private router: Router) { }

  score: number = 0;
  ufoCount: number = 5;
  time: number = 60;
  TIME!: number;
  themissile!: HTMLImageElement;
  theplane!: HTMLImageElement;
  ufoList: HTMLImageElement[] = [];
  ufo_hstep: { [key: string]: number } = {};
  launched: boolean = false;
  pid!: any;
  ufoPID: any[] = [];
  timePID: any;
  recordSaved: boolean = false;
  

  missileStyle = { left: '300px', bottom: '25px', height: '70px', width: '10px' };
  planeStyle = { left: '270px', bottom: '20px', height: '70px', width: '70px' };

  ngOnInit() {
    this.setVariables();
    this.setUfos();
    this.UFOlaunch();
    this.countDown();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    this.keyboardController(event);
  }

  UFOlaunch() {
    for (let i = 0; i < this.ufoCount; i++) {
      this.ufoList[i].style.display = "inline";
      this.ufoPID.push(setInterval(() => this.MoveUFO(this.ufoList[i]), 25));
    }
  }

  MoveUFO(theUfo: HTMLElement) {
    const Rlimit = window.innerWidth;
    let horizontalPos = parseInt(theUfo.style.left),
      ufoWidth = parseInt(theUfo.style.width);

    if (horizontalPos + ufoWidth + 8 > Rlimit || horizontalPos - 8 < 0) {
      this.ufo_hstep[theUfo.style.bottom] *= -1;
    }

    horizontalPos = horizontalPos + this.ufo_hstep[theUfo.style.bottom];
    theUfo.style.left = horizontalPos + 'px';
  }

  pullTrigger() {
    this.pid = setInterval(() => this.launch(), 10);
    this.launched = true;
  }

  checkforaHit(theUfo: HTMLImageElement) {
    const width_ufo = parseInt(theUfo.style.width) / 2,
      height_ufo = parseInt(theUfo.style.height) / 2,
      vpos_ufo = parseInt(theUfo.style.bottom) + height_ufo,
      hpos_ufo = parseInt(theUfo.style.left) + width_ufo,

      width_m = parseInt(this.themissile.style.width) / 2,
      height_m = parseInt(this.themissile.style.height) / 2,
      vpos_m = parseInt(this.themissile.style.bottom) + height_m,
      hpos_m = parseInt(this.themissile.style.left) + width_m;

    return ((Math.abs(hpos_ufo - hpos_m) <= (width_m + width_ufo)) && (Math.abs(vpos_ufo - vpos_m) <= (height_m + height_ufo)));
  }

  launch() {
    const uLimit = window.innerHeight;
    let vpos_m = parseInt(this.themissile.style.bottom),
      vstep = 5;

    // function resetTheMissile(): void {
    //   vpos_m = 25;
    //   clearInterval(this.pid);
    //   this.launched = false;
    //   this.calculateFinalScore();
    // }

    for (let i = 0; i < this.ufoCount; i++) {
      if (this.checkforaHit(this.ufoList[i])) {
        this.score += 100;
        document.getElementById('points')!.innerHTML = this.score.toString();

        vpos_m = 25;
        clearInterval(this.pid);
        this.launched = false;
        // resetTheMissile();

        this.ufoList[i].src = 'assets/img/explosion.gif';
        setTimeout(() => {
          this.ufoList[i].src = 'assets/img/ufo.png';
        }, 1000);
        break;
      }
    }

    if (vpos_m > uLimit) {
      this.score -= 25;
      document.getElementById('points')!.innerHTML = this.score.toString();
      // resetTheMissile();

      vpos_m = 25;
      clearInterval(this.pid);
      this.launched = false;

    } else {
      vpos_m = vpos_m + vstep;
    }

    this.themissile.style.bottom = `${vpos_m}px`;
  }

  moveMissileRight() {
    const rLimit = window.innerWidth;
    let horizontalPos = parseInt(this.theplane.style.left),
      hstep = 5;

    if (horizontalPos + parseInt(this.theplane.style.width) + 2 * hstep < rLimit) {
      horizontalPos = horizontalPos + hstep;
      this.themissile.style.left = horizontalPos + 30 + 'px';
      this.theplane.style.left = horizontalPos + 'px';
    }
  }

  moveMissileLeft() {
    let horizontalPos = parseInt(this.theplane.style.left),
      hstep = 5;

    if (horizontalPos - hstep > 0) {
      horizontalPos = horizontalPos - hstep;
      this.themissile.style.left = horizontalPos + 30 + 'px';
      this.theplane.style.left = horizontalPos + 'px';
    }
  }

  keyboardController(theEvent: KeyboardEvent) {
    const code = theEvent.key;

    if (!this.launched) {
      switch (code) {
        case 'd':
        case 'D':
        case 'ArrowRight':
          this.moveMissileRight();
          break;

        case 'a':
        case 'A':
        case 'ArrowLeft':
          this.moveMissileLeft();
          break;

        case 'Control':
        case ' ':
          this.pullTrigger();
          break;
      }
    }
  }

  setUfos() {
    for (let i = 0; i < this.ufoCount; i++) {
      if (Math.floor(Math.random() * 2)) {
        this.ufo_hstep[this.ufoList[i].style.bottom] = Math.floor(Math.random() * 5) + 3;
      } else {
        this.ufo_hstep[this.ufoList[i].style.bottom] = -(Math.floor(Math.random() * 5) + 3);
      }

      this.ufoList[i].style.left = Math.random() * (window.innerWidth - parseInt(this.ufoList[i].style.width) - 16) + 8 + 'px';
    }
  }

  setVariables() {
    this.ufoCount = parseInt(localStorage.getItem("ufoCount") || '5');
    this.time = parseInt(localStorage.getItem("time") || '60');
    this.TIME = this.time;
    this.themissile = document.getElementById('missile')! as HTMLImageElement;
    this.theplane = document.getElementById('plane')! as HTMLImageElement;

    for (let i = 0; i < this.ufoCount; i++) {
      this.ufoList.push(document.getElementById(`ufo${i}`)! as HTMLImageElement);
    }
  }

  countDown() {
    document.getElementById('time')!.innerHTML = this.time.toString();

    this.timePID = setInterval(() => {
      this.time--;
      document.getElementById('time')!.innerHTML = this.time.toString();

      if (this.time <= 0) {
        this.stopGame();
      }
    }, 1000);
  }

  stopGame() {
    clearInterval(this.pid);
    clearInterval(this.timePID);

    for (let i = 0; i < this.ufoCount; i++) {
      clearInterval(this.ufoPID[i]);
      this.ufoList[i].src = 'assets/img/explosion.gif';
      setTimeout(() => {
        this.ufoList[i].style.display = "none";
      }, 1500);
    }

    if (this.score >= 0) {
      this.score = Math.floor(this.score / (this.TIME / 60)) - (50 * (this.ufoCount - 1));
      document.getElementById('endGameScore')!.innerHTML = this.score.toString();
    } else {
      this.score = this.score - (50 * (this.ufoCount - 1));
      document.getElementById('endGameScore')!.innerHTML = this.score.toString();
    }

    this.loginService.isLoggedIn() ? document.getElementById('saveScore')!.style.display = "inline" : document.getElementById('saveScore')!.style.display = "none";
    document.getElementById('endGame')!.style.display = "inline";
  }

  tryAgain() {
    this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/game']);
    }); 
  }

  saveScore() {
    if (this.recordSaved) {
      alert("You have already saved your score");
      return;
    }

    let saveDate: number = new Date().getTime();
    let saveScore: number = this.score;
    let saveUsername: string = localStorage.getItem("Username")!;
    let saveUfoCount: number = this.ufoCount;
    let saveTime: number = this.TIME;
    let loginToken: string = localStorage.getItem("LoginToken")!;
    const url = "http://wd.etsisi.upm.es:10000/records/";

    interface Data {
      username: string;
      punctuation: number;
      ufos: number;
      disposedTime: number;
      recordDate: number;
    }

    this.http.post<Data>(url, { username: saveUsername, punctuation: saveScore, ufos: saveUfoCount, disposedTime: saveTime, recordDate: saveDate }, { headers: { 'Authorization': loginToken } }).subscribe({
      next: data => {
        this.recordSaved = true;
        alert("Record saved!");
        this.loginService.loginTimeoutRenewal();
      },
      error: error => {
        this.loginService.logout(error.status);
      }
    })
  }

  ngOnDestroy() {
    if (this.pid) {
      clearInterval(this.pid);
    }
    if (this.timePID) {
      clearInterval(this.timePID);
    }
    for(let i = 0; i < this.ufoCount; i++) {
      if (this.ufoPID[i]) {
        clearInterval(this.ufoPID[i]);
      }
    }
  }
}