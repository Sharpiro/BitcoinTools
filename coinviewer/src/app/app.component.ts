import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  textAreaData: string
  userData: string
  entropy: number

  onSubmit(userData: string) {
    this.entropy = Math.random()
    this.userData = userData
  }
}