import { Component, ViewChild, OnInit, AfterViewInit, Inject, Input, OnChanges, SimpleChanges } from "@angular/core"
import { MatTableDataSource, MatSort } from "@angular/material"
import { coinGridServiceToken, CoinGridService, CoinData } from "./coin-grid.interfaces";

@Component({
  selector: "coin-grid",
  templateUrl: "./coin-grid.component.html",
  styleUrls: ["./coin-grid.component.css"]
})
export class CoinGridComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() userData: string;
  @Input() entropy: number;
  @Input() showUsdValue: boolean;
  displayedColumns = [
    "rank",
    "short",
    "mktCap",
    "supply",
    "price",
    "weightedPrice",
    "coins",
    "weightedCoins",
    "usdValue",
    "percentUsdValue",
    "dailyChange",
    "shapeshift"
  ];
  dataSource = new MatTableDataSource();
  allCoinData: CoinData[]
  @ViewChild(MatSort) sort: MatSort;

  constructor( @Inject(coinGridServiceToken) private coinGridService: CoinGridService) { }

  ngOnInit() {
    this.coinGridService.getCoinCapData().subscribe(data => {
      this.dataSource.data = data
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
    })
  }

  toMultiArray(rawUserData: string): string[][] {
    var split = rawUserData.split("\n").filter(d => d).map(d => d.split("\t"))
    split = split.splice(1, split.length)
    return split
  }

  toConsolidatedList(split: string[][], allCoinData: CoinData[]): CoinData[] {
    var dictionary = {}
    var selectedCoins = []
    for (const item of split) {
      if (dictionary[item[0]] == undefined) dictionary[item[0]] = 0
      dictionary[item[0]] += parseFloat(item[1].replace(",", ""))
    }


    var totalUsdValue = 0;
    for (const coinInfo of allCoinData) {
      if (dictionary[coinInfo.short] != undefined) {
        coinInfo.coins = dictionary[coinInfo.short]
        coinInfo.weightedCoins = (coinInfo.coins / coinInfo.supply) * 100000000
        let usdValue = coinInfo.coins * coinInfo.price
        coinInfo.usdValue = usdValue
        totalUsdValue += usdValue
        selectedCoins.push(coinInfo)
      }
    }

    for (const coinInfo of selectedCoins) {
      coinInfo.percentUsdValue = coinInfo.usdValue / totalUsdValue
      if (!this.showUsdValue)
        coinInfo.usdValue = 0
    }

    return selectedCoins
  }
}