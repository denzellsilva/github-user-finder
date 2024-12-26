// Octokit.js
// https://github.com/octokit/core.js#readme
import { Octokit } from "https://esm.sh/@octokit/core";

const octokit = new Octokit({
//  You can provide an authorization token to get more data, but since this project is only client side, no backend, I'm not capable to hiding a 
// key. Therefore, I chose not providing authorization token.
//  auth: 'YOUR_TOKEN'
});

const response = await octokit.request('GET /users/{username}', {
  username: 'denzellsilva',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

console.log(response);