function evaluate(source) {
    var stack = []
    var command = ""
    for (let i = 0; i < source.length; i++) {
        if (source[i] != " ") {
            command += source[i]
            if (i + 1 != source.length)
                continue
        }

        if (command == "op_add") {
            let x = +stack.pop()
            let y = +stack.pop()
            stack.push(x + y)
        }
        else if (command == "op_equal") {
            let x = +stack.pop()
            let y = +stack.pop()
            stack.push(x == y)
        }
        else if (command == "op_sub") {
            let y = +stack.pop()
            let x = +stack.pop()
            stack.push(x - y)
        }
        else stack.push(command)
        command = ""
    }
    if (stack.length != 1) return -1
    return stack[0]
}

var scriptAscii = "2 7 op_add 3 op_sub 1 op_add 7 op_equal"
var scriptBase64 = Buffer.from(scriptAscii).toString("base64")
var parsedAsciiScript = Buffer.from(scriptBase64, "base64").toString("ascii")
const result = evaluate(parsedAsciiScript)
console.log(scriptBase64);
console.log(parsedAsciiScript);
console.log(result);