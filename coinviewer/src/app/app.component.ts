import { Component, HostListener, isDevMode } from '@angular/core';

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
  showUsdValue = false;

  onSubmit(userData: string) {
    this.entropy = Math.random()
    this.userData = userData
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    if (!isDevMode()) {
      return false;
    }
  }
}