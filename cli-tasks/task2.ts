import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let name: string;
let age: number;
let numbers: number[] = [];
let n: number;
let count = 0;

interface UserInput {
    name: string;
    age: number;
}

rl.question('Enter your name: ', (nme: string): void => {
    name = nme;
    rl.question('Enter your age: ', (ag: string): void => {
        age = parseInt(ag);
        if (age < 18) {
            console.log(`Sorry ${name}, you are not eligible to register.`);
            rl.close();
            return;
        }
        rl.question('How many numbers? ', (num: string): void => {
            n = parseInt(num);
            askNumber();
        });
    });
});

function askNumber() {
  if (count < n) {
    rl.question(`Enter number ${count + 1}: `, (num: string): void => {
      numbers.push(parseInt(num));
      count++;
      askNumber();
    });
  } else {
    const evenSum = numbers.filter(x => x % 2 === 0).reduce((a, b) => a + b, 0);
    const oddSum = numbers.filter(x => x % 2 !== 0).reduce((a, b) => a + b, 0);
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    console.log('Sum of even numbers:', evenSum);
    console.log('Sum of odd numbers:', oddSum);
    console.log('Largest number:', max);
    console.log('Smallest number:', min);
    rl.close();
  }
}