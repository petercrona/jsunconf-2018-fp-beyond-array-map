const {eq, compose, find, reverse, forEach, findLastIndex, defaultTo, inRange, map} = require('lodash/fp');

// Functor
class Demo {
    constructor(demos = []) {
        this.demos = demos;
    }

    push(name, fn, runBool, runRepeat) {
        this.demos.push({name, fn, runBool, runRepeat});
    }

    execute(runTogether) {
        const runDemo = forEach(demo => console.log(demo.name + ':', demo.fn()));
        const getDemos = (number) => {
            const interval = defaultTo([number, number+1],
                                       find((arr) => inRange(arr[0], arr[1], number), runTogether));
            return this.demos.slice(interval[0], interval[1]);
        };
        const printLn = (x) => {console.log(''); return x;};

        const run = compose(printLn, runDemo, printLn, getDemos)
        const runReal = compose(run, findLastIndex(x => x.runBool));
        const runRepeat = compose(run, findLastIndex(x => x.runRepeat));
        const noRepeat = compose(eq(-1), findLastIndex(x => x.runRepeat));

        if (noRepeat(this.demos)) {
            runReal(this.demos);
        } else {
            runRepeat(this.demos);
        }
    }

    fmap(fn) {
        return new Demo(map(fn, this.demos));
    }
}

module.exports = Demo;
