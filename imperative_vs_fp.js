const {map, forEach, reduce, flattenDeep, curry, identity, get} = require('lodash/fp');
const _ = require('lodash');






























































// # ====== Example 1 - Given a bunch of users, get only their ids
let users = [{id: 1, name: 'Kalle'}, {id: 2, name: 'Anka'}];
console.log('\n===== Given a bunch of users, get only their ids');
let userIds;






















































// # === Old School JS
userIds = [];
for (let i = 0; i < users.length; i++) {
    userIds.push(users[i].id);
}
console.log('oldschool', userIds);












































// # === 2. Modern JS
userIds = users.map(u => u.id);
console.log('modern', userIds);





































// # === 3. Lodash
userIds = _.map(users, u => u.id);
console.log('lodash', userIds);

// # === 4. Lodash/FP
userIds = map(u => u.id, users);
console.log('lodash/fp', userIds);

console.log('');

// return;


































// #
console.log('\n====== Given a bunch of users, sum the number of comments they have written');

let sum;
users = [
    {id: 1, name: 'Kalle', commentsWritten: 1},
    {id: 2, name: 'Anka', commentsWritten: 6},
    {id: 3, name: 'Leffe', commentsWritten: 10}
];























































// # Old School JS
sum = 0;
for (let i = 0; i < users.length; i++) {
    sum += users[i].commentsWritten;
}
console.log('oldschool', sum);


























































// # Modern JS
sum = users.map(u => u.commentsWritten).reduce((memo, b) => memo + b, 0);
console.log('modern', sum);























































// # Lodash
sum = _.reduce(users, (memo, b) => memo + b.commentsWritten, 0);
console.log('lodash', sum);

// # Lodash/FP
sum = reduce((memo, b) => memo + b.commentsWritten, 0, users);
console.log('lodash/fp', sum);

console.log('');

// return;

// --> Slides




























































// #
console.log('\n====== Working on a tree structure');
// ===== Tree and Maybe example

let userHierarchy = {
    value: {id: 1, name: 'CEO', commentsWritten: 1}, children: [
        {value: {id: 2, name: 'Manager', commentsWritten: 2}, children: [
            {value: {id: 3, name: 'Developer', commentsWritten: 3}, children: []},
            {value: {id: 4, name: 'Designer', commentsWritten: 2}, children: []}
        ]},
        {value: {id: 5, name: 'Albert', commentsWritten: 2}, children: [
            {value: {id: 6, name: 'Xiaoyan', commentsWritten: 3}, children: []},
            {value: {id: 7, name: 'Flora', commentsWritten: 2}, children: [
                {value: {id: 8, name: 'Winston', commentsWritten: 2}, children: []}
            ]}
        ]}
    ]
};


















































// # = Write a function to get the ids of all


















































// # Quite common JS
let getIds = u => [u.value.id, ...u.children.map(getIds)]
console.log('getIds',
            flattenDeep(getIds(userHierarchy))
);

console.log('');

// return;

// --> Slides































































































// # so, map? Worked well before: map(u => u.id, users). Let's try:

const Tree = require('./tree');
console.log('\ntreeMap',
            Tree.map(u => u.id, userHierarchy)
);

console.log('');

// return;


















































// # Ahh, yeah, preserves structure :(

// Anything else we can use?

















































// # Collapse to a single value! That's reduce!
console.log('treeReduce',
            Tree.reduce(
                (memo, u) => {memo.push(u.id); return memo;},
                [],
                userHierarchy
            )
);

console.log('');

// return;





















































// #
// -> Lesson 1: map transforms but keeps structure.
// -> Lesson 2: reduce don't





















































// #
// = Write a function to get the sum of comments written






















































// #
let addCommentsWritten = (a, b) => a + b.commentsWritten;

console.log('reduce tree',
            Tree.reduce(addCommentsWritten, 0, userHierarchy)
);

// Compare with:
console.log('reduce flat',
            reduce(addCommentsWritten, 0, users)
);

console.log('');

// return;

























































// #
// A final example, translate tree to ASCII

console.log('\n===== ASCII');





















































// #
// Utils
const {join, repeat} = require('lodash/fp');

//==== Solution START
let render;

let levelIndicator = level => repeat(level * 2, '-');
let renderChildren = (level, children) => join('', map(render(level), children));

render = curry((level, uNode) =>
    `\n${levelIndicator(level)}${uNode.value.name}${renderChildren(level + 1, uNode.children)}`
);
//==== Solution END

console.log(
    render(0, userHierarchy)
);

console.log('');

// return;








































// #
// Util
const {compose, multiply} = require('lodash/fp');
const on2 = curry((f,g,h,x,y) => f(g(x), h(y)));
const compose2 = curry((f, g, x, y) => f(g(x, y)));
const flip2Args = curry((f, x, y) => f(y, x));
const repeat_ = flip2Args(repeat);

// Solution START
levelIndicator = compose(repeat_('-'), multiply(2));

render = curry((level, uNode) =>
    `\n${levelIndicator(level)}${uNode.value.name}${renderChildren(level + 1, uNode)}`
);

// level -> UserNode -> String
renderChildren = compose2(
    join(''),
    on2(map, render, get('children'))
    // (level, children) => map(render(level), children)
);
// Solution END

console.log(
    render(0, userHierarchy)
);

console.log('');

// --> Slides
