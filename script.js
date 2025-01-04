// Octokit.js
// https://github.com/octokit/core.js#readme
import { Octokit } from "https://esm.sh/@octokit/core";

//  You can provide an authorization token to get more data

// const octokit = new Octokit({
//  auth: 'YOUR_API_KEY'
// });

// But since this project is only client side, no backend, I'm not capable to hiding a key. Therefore, I chose not providing authorization token.

const octokit = new Octokit();

async function octokitFetchData() {
  const response = await octokit.request('GET /users/{username}', {
    username: 'kamranahmedse',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  
  console.log(response);
}

octokitFetchData();