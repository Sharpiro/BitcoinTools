import { Component, ViewChild, OnInit, AfterViewInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core'
import { MatTableDataSource, MatSort } from '@angular/material'
import { coinGridServiceToken, CoinGridService, CoinData } from './coin-grid.interfaces';

@Component({
  selector: 'coin-grid',
  templateUrl: './coin-grid.component.html',
  styleUrls: ['./coin-grid.component.css']
})
export class CoinGridComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() userData: string;
  @Input() entropy: number;
  displayedColumns = [
    'rank',
    'short',
    'mktCap',
    'supply',
    'price',
    'weightedPrice',
    'coins',
    'usdValue',
    'dailyChange',
    'shapeshift'
  ];
  dataSource = new MatTableDataSource();
  allCoinData: CoinData[]
  @ViewChild(MatSort) sort: MatSort;

  constructor( @Inject(coinGridServiceToken) private coinGridService: CoinGridService) { }

  ngOnInit() {
    this.coinGridService.getCoinCapData().subscribe(data => {
      this.dataSource.data = data//.slice(0, 8)
      this.allCoinData = data
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.userData) return
    this.dataSource.data = []

    const multiArray = this.toMultiArray(this.userData)
    this.coinGridService.getCoinCapData().subscribe(data => {
      this.allCoinData = data
      const consolidatedList = this.toConsolidatedList(multiArray, this.allCoinData)
      this.dataSource.data = consolidatedList
      console.log(consolidatedList)
      console.log("child component updated")
    })
  }

  toMultiArray(rawUserData: string): string[][] {
    var split = rawUserData.split("\n").filter(d => d).map(d => d.split("\t"))
    split = split.splice(1, split.length)
    return split
  }

  toConsolidatedList(split: string[][], allCoinData: CoinData[]): CoinData[] {
    var dictionary = {}
    var list = []
    for (const item of split) {
      if (dictionary[item[0]] == undefined) dictionary[item[0]] = 0
      dictionary[item[0]] += parseFloat(item[1].replace(",", ""))
    }

    for (const item of allCoinData) {
      if (dictionary[item.short] != undefined) {
        item.coins = dictionary[item.short]
        item.usdValue = item.coins * item.price
        list.push(item)
      }
    }

    return list
  }
}