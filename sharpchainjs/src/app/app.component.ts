import { Component, OnInit } from '@angular/core'
import { WebWorkerService } from 'angular2-web-worker'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app'

  constructor(private webWorkerService: WebWorkerService) { }

  ngOnInit() { }
}