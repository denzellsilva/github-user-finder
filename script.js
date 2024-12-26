// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: 'YOUR-TOKEN'
})

const response = await octokit.request('GET /users/{username}', {
  username: 'denzellsilva',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

console.log(response);