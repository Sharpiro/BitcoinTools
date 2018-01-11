var allCoinData

refreshCoinData().then(data => {
    console.log("coin data retrieved")
    allCoinData = data
})

refresh.onclick = (event) => {
    refreshCoinData().then(data => {
        console.log("coin data retrieved")
        allCoinData = data
    })
}

submit.onclick = (event) => {
    if (!allCoinData) {
        console.log("no coin data")
        return
    }
    if (!inputTextArea.value) {
        console.log("no input data")
        return
    }
    var data = inputTextArea.value
    var split = data.split("\n").filter(d => d).map(d => d.split("\t"))
    split = split.splice(1, split.length)
    var consolidatedList = toConsolidatedList(split, allCoinData)
    var viewList = consolidatedList.map(c => {
        return {
            short: c.short,
            mktCap: c.mktcap,
            supply: c.supply,
            price: c.price,
            weightedPrice: (c.price / c.supply) * 100000000,
            myAmount: c.myAmount,
            usdValue: c.usdValue,
            dailyChange: c.cap24hrChange,
            shapeshift: c.shapeshift
        }
    })
    // var totalValue = viewList.map(l => l.usdValue).reduce((prev, next) => prev + next)
    var excelList = viewList.map((coin, index) => {
        return (index + 1) + "\t" + coin.short + "\t" + coin.mktCap + "\t" + coin.supply + "\t" + coin.price + "\t" + coin.weightedPrice + "\t" + coin.myAmount + "\t" + coin.usdValue + "\t" + coin.dailyChange + "\t" + coin.shapeshift
    })
    excelList.unshift("rank\tname\tmktCap\tsupply\tprice\tweightedPrice\tmyAmount\tusdValue\tdailyChange\tshapeshift")
    outputTextArea.innerText = excelList.join("\n")
    // totalValueElement.innerText = totalValue
    console.log(viewList)
    // console.log(totalValue)
}

function refreshCoinData() {
    return new Promise((res, rej) => {
        var response = fetch("http://coincap.io/front")
        var dataPromise
        response.then(data => {
            dataPromise = data.json()
            dataPromise.then(json => {
                res(json)
            })
        })
    })
}

function toConsolidatedList(split, allCoinData) {
    var dictionary = {}
    var list = []
    for (var item of split) {
        if (dictionary[item[0]] == undefined) dictionary[item[0]] = 0
        dictionary[item[0]] += parseFloat(item[1].replace(",", ""))
    }

    for (var item of allCoinData) {
        if (dictionary[item.short] != undefined) {
            item.myAmount = dictionary[item.short]
            item.usdValue = item.myAmount * item.price
            list.push(item)
        }
    }

    return list
}