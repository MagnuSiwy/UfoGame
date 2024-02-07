import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent {
  constructor(private loginService: LoginService, private http: HttpClient, private router: Router) { }

  url: string = "http://wd.etsisi.upm.es:10000/records";

  ngOnInit() {
    this.userRequest();
  }

  printData(data: any[], divID: string) {
    const tableDiv = document.getElementById(divID);

    if (tableDiv) {
      const table = document.createElement('table');
      const headers = ["User:", "Score:", "Ufo's:", "Time:", "Date:"];
      const infoCount = headers.length;

      function createRow(array: string[], isTableHead: boolean) {
        const row = document.createElement('tr');

        for (let i = 0; i < infoCount; i++) {
          const cellData = array[i];
          let cell: HTMLTableCellElement;

          if (isTableHead) {
            cell = document.createElement("th");
          } else {
            cell = document.createElement("td");
          }

          cell.textContent = cellData;
          row.appendChild(cell);
        }

        table.appendChild(row);
      }

      createRow(headers, true);

      for (let i = 0; i < data.length; i++) {
        const date = new Date(data[i].recordDate);
        const rowData = [
          data[i].username,
          data[i].punctuation,
          data[i].ufos,
          data[i].disposedTime,
          `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        ];

        createRow(rowData, false);
      }

      table.style.minWidth = '300px';
      table.style.width = 'fit-content';
      table.style.textAlign = 'center';
      tableDiv.appendChild(table);
    } else {
      console.error('tableDiv is null');
    }
  }

  userRequest() {    
    interface record {
      username: string;
      punctuation: number;
      ufos: number;
      disposedTime: number;
      recordDate: number;
    }

    this.http.get<record[]>(this.url).subscribe({
      next: (data: any) => {
        this.printData(data, 'responseDIV');
      },
      error: error => {
        this.loginService.logout(error.status);
      }
    })

    if (this.loginService.isLoggedIn()) {
      this.loginService.loginTimeoutRenewal();
      document.getElementById('recordsDIV')!.style.display = "inline"
      let loginToken: string = localStorage.getItem("LoginToken")!;

      this.http.get<record[]>(`${this.url}/${localStorage.getItem("Username")}`, { headers: { 'Authorization': loginToken } }).subscribe({
        next: (data: any) => {
          this.printData(data, 'recordsDIV');
        },
        error: error => {
          this.loginService.logout(error.status);
        }
      })
    }
    else {
      document.getElementById('recordsDIV')!.style.display = "none";
    }
  }

  deleteRecords() {
    this.http.delete(this.url, {headers: { 'Authorization': localStorage.getItem("LoginToken")! }}).subscribe({
      next: () => {
        alert("Records deleted!");
        this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/records']);
        }); 
      },
      error: error => {
        this.loginService.logout(error.status);
      }
    })
  }
}
