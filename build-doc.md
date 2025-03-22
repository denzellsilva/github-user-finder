# Build Function

## Conditionals in Build Function
You can't use `if-else` or `switch` statements directly within a build function call because this function expects arrays as arguments. Since conditional statements cannot be used inside an array, you need alternative approaches. Here are some methods you can use:
- [Using the Spread Operator](#using-the-spread-operator) - if you want a more explicit and consistent approach. If you want to call multiple `build()` when the condition is true.
- [Using Ternary Operator without wrapping build() in Arrays](#using-ternary-operator-without-wrapping-in-arrays) - if you prefer a simpler syntax call `build()` once.

### Using the Spread Operator
In order to do conditionals in the build function call, you need to use the spread operator (`...`) and ternary operator (`? :`). The spread operator (`...`) flattens the conditional arrays into the parent array. If the condition is `true`, the elements of the array are added directly to the parent array. If the condition is `false`, an empty array (`[]`) is spread, which has no effect.

### Example With Spread Operator
```js
function AdditionalInfo(data) {
  return build(['ul'], 
  [
    ...(data['location'] ?
    [
      build(['li'], 
      [
        `Location:  ${data['location']}`,
      ]),
    ]
    : []),
    ...(data['company'] ?
    [
      build(['li'], 
      [
        `Company: ${data['company']}`,
      ]),
    ]
    : []),
    ...(data['blog'] ? 
    [
      build(['li'], 
      [
        'Blog: ',
        build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
      ]),
    ]
    : []),
    ...(data['twitter_username'] ? 
    [
      build(['li'], 
      [
        'Twitter: ',
        build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']]),
      ]),
    ]
    : []),
  ]);
}
```

### Resulting structure Array
If `data['location']`, `data['company']`, `data['blog']`, or `data['twitter_username']` exist, the structure array will look like this:

```js
[
  build(['li'], [`Location: ${data['location']}`]),
  build(['li'], ['Company: ', build(['a'], [data['company']])]),
  build(['li'], ['Blog: ', build(['a', { href: data['blog'], target: 'blank' }], [data['blog']])]),
  build(['li'], ['Twitter: ', build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']])]),
]
```

### Example With Spread Operator and Calling Multiple build()
```js
function AdditionalInfo(data) {
  return build(['ul'], 
  [
    ...(data['location'] && data['followers'] ?
    [
      build(['li'], 
      [
        `Location:  ${data['location']}`,
      ]),
      build(['li'], 
      [
        `Followers:  ${data['followers']}`,
      ]),
    ]
    : []),
    ...(data['company'] ?
    [
      build(['li'], 
      [
        `Company: ${data['company']}`,
      ]),
    ]
    : []),
    ...(data['blog'] ? 
    [
      build(['li'], 
      [
        'Blog: ',
        build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
      ]),
    ]
    : []),
    ...(data['twitter_username'] ? 
    [
      build(['li'], 
      [
        'Twitter: ',
        build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']]),
      ]),
    ]
    : []),
  ]);
}
```

### Resulting structure Array
Notice that in the first ternary operation, the `build()` is called multiple times and still worked even though a ternary operator only accepts a single expression to every condition. In this case, the whole expression was stored in a single array which makes it a single expression, but the values inside the array are spread using the spread operator. Thus, resulting the following structure:

```js
[
  build(['li'], [`Location: ${data['location']}`]),
  build(['li'], [`Follwers: ${data['follwers']}`]),
  build(['li'], ['Company: ', build(['a'], [data['company']])]),
  build(['li'], ['Blog: ', build(['a', { href: data['blog'], target: 'blank' }], [data['blog']])]),
  build(['li'], ['Twitter: ', build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']])]),
]
```

### What happens if we dont use the spread operator?
If you don't use the spread operator (`...`) in your AdditionalInfo function, the conditional arrays (e.g., for `data['location']`, `data['company']`, `data['blog']`, and `data['twitter_username']`) will remain as nested arrays inside the parent array. This can cause issues when the build function processes the structure array because it expects individual nodes, not nested arrays.

### Example Without Spread Operator
```js
function AdditionalInfo(data) {
  return build(['ul'], 
  [
    data['location'] ? 
    [
      build(['li'], 
      [
        'Location: ',
        build(['a'], [data['location']]),
      ]),
    ]
    : [],
    data['company'] ? 
    [
      build(['li'], 
      [
        'Company: ',
        build(['a'], [data['company']]),
      ]),
    ]
    : [],
    data['blog'] ?
    [
      build(['li'], 
      [
        'Blog: ',
        build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
      ]),
    ]
    : [],
    data['twitter_username'] ? 
    [
      build(['li'], 
      [
        'Twitter: ',
        build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']]),
      ]),
    ]
    : [],
  ]);
}
```

### Resulting structure Array
If `data['location']`, `data['company']`, `data['blog']`, or `data['twitter_username']` exist, the structure array will look like this:

```js
[
  [build(['li'], [`Location: ${data['location']}`])],
  [build(['li'], ['Company: ', build(['a'], [data['company']])])],
  [build(['li'], ['Blog: ', build(['a', { href: data['blog'], target: 'blank' }], [data['blog']])])],
  [build(['li'], ['Twitter: ', build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']])])],
]
```

Notice that all four elements are **nested arrays**.

### What Happens in the build function
When the build function processes the structure array, it will encounter these nested arrays. Since the build function expects each element of the structure array to be a falsy value, HTMLElement or a string, it will not know how to handle the nested arrays. This will likely result in an error or unexpected behavior.

For example:
```js
let previousNode; // tracks previous node
  for (const node of structure) {
    if (!node) {
      continue;
    } else if (node instanceof HTMLElement) {
      // append the node if its an html element
      element.appendChild(node);
    } else if (typeof node === 'string') {
      let textNode;
      // if the previous node is a text, add a single space on creating the text node.
      typeof previousNode === 'string' ? textNode = document.createTextNode(` ${node}`) : textNode = document.createTextNode(node);
      element.appendChild(textNode);
    } else {
      console.error(`Invalid HTML node in array: ${node} in build(). Called at: ${functionCallLine()}`);
    }
    // updates previousNode value witht the current value of node before iterating to the next loop
    previousNode = node;
  }
```

- When node is a nested array (e.g., `[build(...)]`), it will not match `!node`, `instanceof HTMLElement` or `typeof node === 'string'`.
- The `else` block will execute, logging an error: `Invalid HTML node in array: [object Object]`.

### Using Ternary Operator Without Wrapping in Arrays
```js
function AdditionalInfo(data) {
  return build(['ul'], 
  [
    data['location'] ? build(['li'], 
    [
      'Location: ',
      build(['a'], [data['location']]),
    ])
    : '',

    data['company'] ? build(['li'], 
    [
      'Company: ',
      build(['a'], [data['company']]),
    ])
    : '',

    data['blog'] ? build(['li'], 
    [
      'Blog: ',
      build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
    ])
    : '',

    data['twitter_username'] ? build(['li'], 
    [
      'Twitter: ',
      build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']]),
    ])
    : '',
  ]);
}
```

### How This Works
1. Ternary Operator:
    - The ternary operator checks if the condition (e.g., `data['blog']`) is truthy.
    - If the condition is true, it directly returns the result of the build function.
    - If the condition is false, it returns an empty string.
2. Flat Array:
    - Since the build function calls are not wrapped in arrays, the resulting array passed to the build function is flat.
    - falsy values like `''`, `null`, `undefined`,`0`, `NaN`, or `false` are ignored when appending child nodes in the DOM, so they won't cause issues.

### Resulting structure Array
If `data['location']`, `data['company']`, `data['blog']`, or `data['twitter_username']` exist, the structure array will look like this:

```js
[
  build(['li'], [`Location: ${data['location']}`]),
  build(['li'], ['Blog: ', build(['a', { href: data['blog'], target: 'blank' }], [data['blog']])]),
  build(['li'], ['Company: ', build(['a'], [data['company']])]),
  build(['li'], ['Twitter: ', build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']])]),
]
```

If any of the conditions are false, the corresponding element will be `''`:
```js
[
  build(['li'], [`Location: ${data['location']}`]),
  '',
  build(['li'], ['Company: ', build(['a'], [data['company']])]),
  '',
]
```

### Pros of This Approach
1. **No Spread Operator Needed**:
    - You don't need to use the spread operator to flatten arrays.
    - The array remains flat by design.
2. **Simpler Syntax**:
    - The ternary operator directly returns the build function result or `''`, making the code concise.
3. **DOM Compatibility**:
    - `''` values in the array are ignored when appending child nodes, so they won't cause errors.

### Cons of This Approach
1. **Less Explicit**
    - Using `''` as a placeholder for "no element" might not be as explicit as using an empty array with the spread operator.
2. **Potential for Confusion:**
    - Mixing `''` values with valid elements in the array might confuse developers unfamiliar with this pattern.
3. **Can't Call build() Multiple Times**
    - Ternary operations only accepts a single expression to every condition that's why you can call build() multiple times.

## Final Recommendation
Both approaches (using the spread operator or using the ternary operator with `''`) are valid. The choice depends on your team's coding style and preferences:
- **Use the spread operator** if you want a more explicit and consistent approach.
- **Use the ternary operator with `''`** if you prefer a simpler syntax.