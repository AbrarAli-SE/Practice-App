"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var name;
var age;
var numbers = [];
var n;
var count = 0;
rl.question('Enter your name: ', function (nme) {
    name = nme;
    rl.question('Enter your age: ', function (ag) {
        age = parseInt(ag);
        if (age < 18) {
            console.log("Sorry ".concat(name, ", you are not eligible to register."));
            rl.close();
            return;
        }
        rl.question('How many numbers? ', function (num) {
            n = parseInt(num);
            askNumber();
        });
    });
});
function askNumber() {
    if (count < n) {
        rl.question("Enter number ".concat(count + 1, ": "), function (num) {
            numbers.push(parseInt(num));
            count++;
            askNumber();
        });
    }
    else {
        var evenSum = numbers.filter(function (x) { return x % 2 === 0; }).reduce(function (a, b) { return a + b; }, 0);
        var oddSum = numbers.filter(function (x) { return x % 2 !== 0; }).reduce(function (a, b) { return a + b; }, 0);
        var max = Math.max.apply(Math, numbers);
        var min = Math.min.apply(Math, numbers);
        console.log('Sum of even numbers:', evenSum);
        console.log('Sum of odd numbers:', oddSum);
        console.log('Largest number:', max);
        console.log('Smallest number:', min);
        rl.close();
    }
}
