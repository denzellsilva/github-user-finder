# Build Function

# What happens if i dont use the spread operator?

If you don't use the spread operator (...) in your AdditionalInfo function, the conditional arrays (e.g., for data['blog'], data['company'], and data['twitter_username']) will remain as nested arrays inside the parent array. This can cause issues when the build function processes the structure array because it expects individual nodes, not nested arrays.

### Example Without Spread Operator

```js
function AdditionalInfo(data) {
  return build(['ul'], [
    build(['li'], [`Location: ${data['location']}`]),
    data['blog']
      ? [
          build(['li'], [
            'Blog: ',
            build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
          ]),
        ]
      : [],
    data['company']
      ? [
          build(['li'], [
            'Company: ',
            build(['a'], [data['company']]),
          ]),
        ]
      : [],
    data['twitter_username']
      ? [
          build(['li'], [
            'Twitter: ',
            build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [
              data['twitter_username'],
            ]),
          ]),
        ]
      : [],
  ]);
}
```

Resulting structure Array
If `data['blog']`, `data['company']`, or `data['twitter_username']` exist, the structure array will look like this:
```js
[
  build(['li'], [`Location: ${data['location']}`]),
  [build(['li'], ['Blog: ', build(['a', { href: data['blog'], target: 'blank' }], [data['blog']])])],
  [build(['li'], ['Company: ', build(['a'], [data['company']])])],
  [build(['li'], ['Twitter: ', build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']])])],
]
```

Notice that the second, third, and fourth elements are nested arrays.

What Happens in the build Function
When the build function processes the structure array, it will encounter these nested arrays. Since the build function expects each element of the structure array to be either an HTMLElement or a string, it will not know how to handle the nested arrays. This will likely result in an error or unexpected behavior.

For example:
for (const node of structure) {
  if (node instanceof HTMLElement) {
    element.appendChild(node);
  } else if (typeof node === 'string') {
    element.appendChild(document.createTextNode(node));
  } else {
    console.error(`Invalid HTML node in array: ${node}`);
  }
}

- When node is a nested array (e.g., [build(...)]), it will not match instanceof HTMLElement or typeof node === 'string'.
- The else block will execute, logging an error: Invalid HTML node in array: [object Object].

Example With Spread Operator

function AdditionalInfo(data) {
  return build(['ul'], [
    build(['li'], [`Location: ${data['location']}`]),
    ...(data['blog']
      ? [
          build(['li'], [
            'Blog: ',
            build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
          ]),
        ]
      : []),
    ...(data['company']
      ? [
          build(['li'], [
            'Company: ',
            build(['a'], [data['company']]),
          ]),
        ]
      : []),
    ...(data['twitter_username']
      ? [
          build(['li'], [
            'Twitter: ',
            build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [
              data['twitter_username'],
            ]),
          ]),
        ]
      : []),
  ]);
}

Resulting structure Array