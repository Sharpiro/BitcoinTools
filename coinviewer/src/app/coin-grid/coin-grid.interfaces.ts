import { Observable } from "rxjs/Observable";
import { InjectionToken } from "@angular/core";

export interface CoinData {
    rank: number,
    short: string
    mktCap: number
    supply: number
    price: number
    weightedPrice: number
    coins?: number
    usdValue?: number
    dailyChange: number
    shapeshift: boolean
}

export interface CoinGridService {
    getCoinCapData(): Observable<CoinData[]>
}

export const coinGridServiceToken = new InjectionToken<CoinGridService>("coinGridServiceToken")