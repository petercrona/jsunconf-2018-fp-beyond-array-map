const {toUpper, set, compose, map, forEach, reduce, flattenDeep, curry, identity, get} = require('lodash/fp');
const Demo = require('./demo');
const _ = require('lodash');

const demo = new Demo();



























































// # ====== Example 1 - Given a bunch of users, get only their ids





























































































// # === Old School JS
demo.push('oldschool', () => {
    const users = [{id: 1, name: 'Kalle'}, {id: 2, name: 'Anka'}];

    const userIds = [];
    for (let i = 0; i < users.length; i++) {
        userIds.push(users[i].id);
    }

    return userIds;

});

































































// # === 2. Modern JS
demo.push('modern', () => {
    const users = [{id: 1, name: 'Kalle'}, {id: 2, name: 'Anka'}];

    return users.map(u => u.id);

});




































































// # === 3. Lodash
demo.push('lodash', () => {
    const users = [{id: 1, name: 'Kalle'}, {id: 2, name: 'Anka'}];

    return _.map(users, u => u.id);

});

// # === 4. Lodash/FP
demo.push('lodash/fp', () => {
    const users = [{id: 1, name: 'Kalle'}, {id: 2, name: 'Anka'}];

    return map(u => u.id, users);

}, true);



































































// # Given a bunch of users, sum the number of comments they have written





































































// # Old School JS
demo.push('oldschool', () => {
    const users = [
        {id: 1, name: 'Kalle', commentsWritten: 1},
        {id: 2, name: 'Anka', commentsWritten: 6},
        {id: 3, name: 'Leffe', commentsWritten: 10}
    ];

    let sum = 0;
    for (let i = 0; i < users.length; i++) {
        sum += users[i].commentsWritten;
    }

    return sum;

});

























































// # Modern JS
demo.push('modern', () => {
    const users = [
        {id: 1, name: 'Kalle', commentsWritten: 1},
        {id: 2, name: 'Anka', commentsWritten: 6},
        {id: 3, name: 'Leffe', commentsWritten: 10}
    ];

    return users
        .map(u => u.commentsWritten)
        .reduce((memo, commentsWritten) => memo + commentsWritten, 0);

});























































// # Lodash
demo.push('lodash', () => {
    const users = [
        {id: 1, name: 'Kalle', commentsWritten: 1},
        {id: 2, name: 'Anka', commentsWritten: 6},
        {id: 3, name: 'Leffe', commentsWritten: 10}
    ];

    return _.reduce(users, (memo, b) => memo + b.commentsWritten, 0);

});

// # Lodash/FP
demo.push('lodash/fp', () => {
    const users = [
        {id: 1, name: 'Kalle', commentsWritten: 1},
        {id: 2, name: 'Anka', commentsWritten: 6},
        {id: 3, name: 'Leffe', commentsWritten: 10}
    ];

    return reduce((memo, b) => memo + b.commentsWritten, 0, users);

}, true);

// --> Slides




























































// # Working on a tree structure

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










































































// # Quite normal JS
demo.push('normal js', () => {

    const getIds = u => [u.value.id, ...u.children.map(getIds)]
    return getIds(userHierarchy);

}, true);

// --> Slides































































































// # so, map? Worked well before:

// map(u => u.id, users).

// Will it work?






































































// util
const Tree = require('./tree');

demo.push('treeMap', () =>

    Tree.map(u => u.id, userHierarchy)

, true);

















































































// # Ahh, yeah, preserves structure :(

// Anything else we can use?





















































































// # Collapse to a single value! That's reduce!

demo.push('treeReduce', () =>

    Tree.reduce(
        (memo, u) => {memo.push(u.id); return memo;},
        [],
        userHierarchy
    )

, true);































































// #
// -> Lesson 1: map transforms but keeps structure.
// -> Lesson 2: reduce doesn't
// -> Lesson 3: List is one example, Demo is another!

// const demo = new Demo();


















































































// #
// = Write a function to get the sum of comments written



















































































// #
demo.push('commentsWritten', () => {

    let addCommentsWritten = (a, b) => a + b.commentsWritten;

    return Tree.reduce(addCommentsWritten, 0, userHierarchy);
    //          reduce(addCommentsWritten, 0, users) -- solution for list!

}, true);





























































// #
// A final example, translate tree to ASCII




































































































// #
// Utils
const {join, repeat} = require('lodash/fp');

demo.push('Organisation', () => {
    let render;

    let levelIndicator = level => repeat(level * 2, '-');
    let renderChildren = (level, uNode) => join('', map(render(level), uNode.children));

    render = curry((level, uNode) =>
        `\n${levelIndicator(level)}${uNode.value.name}${renderChildren(level + 1, uNode)}`
    );

    return render(1, userHierarchy);

}, true);























































































// #

// Util
const {multiply} = require('lodash/fp');
const on2 = curry((f,g,h,x,y) => f(g(x), h(y)));
const compose2 = curry((f, g, x, y) => f(g(x, y)));
const flip2Args = curry((f, x, y) => f(y, x));
const repeat_ = flip2Args(repeat);

demo.push('To Mock a Mockingbird', () => {

    // Number -> String
    levelIndicator = compose(repeat_('-'), multiply(2));

    render = curry((level, uNode) =>
        `\n${levelIndicator(level)}${uNode.value.name}${renderChildren(level + 1, uNode)}`
    );

    // Number -> UserNode -> String
    renderChildren = compose2(
        join(''),
        on2(map, render, get('children'))
        // (level, uNode) => map(render(level), uNode.children)
    );

    return render(1, userHierarchy);

}, true);

// "Point-Free or Die: Tacit Programming in Haskell and Beyond" by Amar Shah


// --> Slides

const lift2 = curry((f,g,h,x) => f(g(x), h(x)));
demo.fmap(lift2(set('name'),
                compose(toUpper, get('name')),
                identity))
    .execute([[0, 4], [4, 8]]);





























































































/*
const lift2 = curry((f,g,h,x) => f(g(x), h(x)));
   demo.fmap(lift2(set('name'),
   compose(toUpper, get('name')),
   identity))
   .execute([[0, 4], [4, 8]]);

 */
