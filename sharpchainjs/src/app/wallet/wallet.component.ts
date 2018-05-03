import { Component, OnInit } from '@angular/core';
import { CustomFormControl } from '../shared/angular_extensions/customFormControl';
import { hexValidator } from '../shared/angular_extensions/CustomValidators';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  privateKeyControl = new CustomFormControl('', [hexValidator]);

  constructor() { }

  ngOnInit() {
  }
}