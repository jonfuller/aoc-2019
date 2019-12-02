import readline = require('readline');
import fs = require('fs');
import { once } from 'events';

function fuelForMass(mass: number) {
    return Math.max(0, integerDivision(mass, 3).quotient - 2)
}

function fuelForModule(mass: number) {
    if (mass == 0)
        return 0
    var fuel = fuelForMass(mass)
    return fuel + fuelForModule(fuel)
}

function integerDivision(top: number, bottom: number): {quotient: number, remainder: number} {
    var remainder = top % bottom;
    var quotient = (top-remainder)/bottom;

    return {remainder, quotient}
}

async function getLines(filename: string) : Promise<Array<string>> {
    var data = [];

    var reader = readline.createInterface(fs.createReadStream(filename));
    reader.on('line', line => {
        data.push(line);
    });

    await once(reader, 'close');

    return data;
}

console.log(`14 (2): ${fuelForModule(14)}`);
console.log(`1969 (966): ${fuelForModule(1969)}`);
console.log(`100756 (50346): ${fuelForModule(100756)}`);

getLines("res/1/input").then(lines => {
    const sum = lines
        .map(line => Number(line))
        .map(i => fuelForModule(i))
        .reduceRight((acc, curr) => acc + curr, 0);
    
        console.log(`answer: ${sum}`);
    });
