import readline = require('readline');
import fs = require('fs');
import { once } from 'events';

type Program = number[]

async function getLines(filename: string) : Promise<Array<string>> {
    var data = [];

    var reader = readline.createInterface(fs.createReadStream(filename));
    reader.on('line', line => {
        data.push(line);
    });

    await once(reader, 'close');

    return data;
}

function getArgs(currentPointer: number, program: Program): {arg1: number, arg2: number, destPosition: number} {
    const posArg1 = program[currentPointer +1]
    const posArg2 = program[currentPointer +2]
    const posDest = program[currentPointer + 3]

    return {arg1: program[posArg1], arg2: program[posArg2], destPosition: posDest}
}

function processCurrent(currentPointer: number, program: Program): {halt: Boolean, pointer: number, program: Program} {
    const ADD = 1;
    const MUL = 2;
    const EXIT = 99;

    let opCode = program[currentPointer];

    if (opCode == ADD) {
        const x = getArgs(currentPointer, program)
        program[x.destPosition] = x.arg1 + x.arg2
    }
    if (opCode == MUL) {
        const x = getArgs(currentPointer, program)
        program[x.destPosition] = x.arg1 * x.arg2
    }
    if (opCode == EXIT)
        return {halt: true, pointer: -1, program}

    return {halt: false, pointer: currentPointer+4, program}
}

function runProgram(program: Program): Program {

    let next = processCurrent(0, program)
    while(!next.halt) {
        next = processCurrent(next.pointer, next.program)
    }
    return next.program;
}

function runComputer(program: Program, noun: number, verb: number): number {
    program[1] = noun
    program[2] = verb

    return runProgram(program)[0]
}

function range(start: number, end: number): number[] {
    return Array.from({length: (end - start)}, (v, k) => k + start);
}

function cartesianProduct(a) { // a = array of array
    var i, j, l, m, a1, o = [];
    if (!a || a.length == 0) return a;

    a1 = a.splice(0, 1)[0]; // the first array of a
    a = cartesianProduct(a);
    for (i = 0, l = a1.length; i < l; i++) {
        if (a && a.length) for (j = 0, m = a.length; j < m; j++)
            o.push([a1[i]].concat(a[j]));
        else
            o.push([a1[i]]);
    }
    return o;
}

const puzzles = [
    "1,9,10,3,2,3,11,0,99,30,40,50",
    "1,0,0,0,99",
    "2,3,0,3,99",
    "2,4,4,5,99,0",
    "1,1,1,4,99,5,6,0,99",
];

puzzles
    .map(puzzle => puzzle.trim().split(',').map(i => Number(i)))
    .forEach(puzzle => {
        const final = runProgram(puzzle)[0]
        console.log(final)
    });

fs.readFile("res/2/input", (_, data) => {
    const program = data.toString().trim().split(',').map(i => Number(i));

    const cart = cartesianProduct([range(0, 100), range(0, 100)])
        .map(arr => { return {noun: arr[0], verb: arr[1]}})

    for(const pair of cart) {
        if (runComputer(program.slice(0), pair.noun, pair.verb) == 19690720) {
            console.log(`Found! noun: ${pair.noun}  verb: ${pair.verb} ---> ${100*pair.noun + pair.verb}`)
            console.log(pair)
            break;
        }
    }
    console.log("done")
});