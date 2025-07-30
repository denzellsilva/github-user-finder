import { roundNumber, basePath } from "../functions.js";

export function ReposSection(repos) {
  repos = repos.map((repo) => {
    const repoStars = roundNumber(repo['stargazers_count']);
    return `
      <li class="repo">
        <header class="repo-header">
          <a href="${repo['html_url']}" target="_blank" rel="noopener noreferrer">${repo['name']}</a>
          <p class="data-flex">
            <img src="${basePath('assets/star-icon.svg')}" class="star-icon" alt="star icon">
            <span>${repoStars}</span>
          </p>
        </header>
        ${repo['language'] ? `<p class="prog-lang">${repo['language']}</p>` : ''}
        ${repo['description'] ? `<p>${repo['description']}</p>` : ''}
      </li>
    `;
  });

  return `
    <section class="repos">
      <h2>Popular repositories</h2>
      <ul>
        ${repos.join('')}
      </ul>
    </section>
  `;
}