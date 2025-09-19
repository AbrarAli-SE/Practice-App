"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Enter n: ', function (input) {
    var n = parseInt(input);
    for (var i = 1; i <= n; i++) {
        var row = '';
        for (var j = 1; j <= i; j++) {
            row += j + ' ';
        }
        console.log(row.trim());
    }
    rl.close();
});
