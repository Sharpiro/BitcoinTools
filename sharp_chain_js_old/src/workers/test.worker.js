var i = 0

function timedCount() {
    i = i + 1
    postMessage(i)
    setTimeout(timedCount, 1000)
}

onmessage = (event) => {
    console.log(event)
    // postMessage()
}
