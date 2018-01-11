import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from "@angular/http"
import { CoinData, CoinGridService } from './coin-grid.interfaces';

@Injectable()
export class CoinGridApiService implements CoinGridService {

  constructor(private http: Http) { }

  getCoinCapData(): Observable<CoinData[]> {
    const now = new Date().getTime()
    const observable = this.http.get(`http://coincap.io/front?t=${now}`)
      .map(res => {
        const rawData: any[] = res.json()
        if (!rawData || !rawData.length) throw "an error occurred requesting data from coincap"
        const mappedArray = rawData.map((cd, i) => {
          return {
            rank: i + 1,
            short: cd.short,
            mktCap: cd.mktcap,
            supply: cd.supply,
            price: cd.price,
            weightedPrice: (cd.price / cd.supply) * 100000000,
            dailyChange: cd.cap24hrChange,
            shapeshift: cd.shapeshift
          }
        })
        return mappedArray
      })
    return observable
  }
}