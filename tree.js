const _ = require('lodash/fp');

/* Note about curry

   curry(add(a, b) => a + b)

   add(1)(2) === 3
   add(1) === x => 1 + x
*/

const map = _.curry((fn, node) => ({value: fn(node.value), children: node.children.map(map(fn))}));

const reduce = _.curry((fn, init, node) => {
    const nodes = [];
    map(x => nodes.push(x), node);
    return _.reduce(fn, init, nodes);
});

module.exports = {map, reduce};
