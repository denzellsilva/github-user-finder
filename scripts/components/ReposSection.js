import { build } from "../build.js";
import { roundNumber } from "../functions.js";
import { basePath } from "../functions.js";

export function ReposSection(repos) {
  repos = repos.map((repo) => {
    const repoStars = roundNumber(repo['stargazers_count']);

    const listItem = build(['li', { class: 'repo' }], 
    [
      build(['header', {class: 'repo-header'}], 
      [
        build(['a', { href: repo['html_url'], target: 'blank' }], [repo['name']]),
        build(['p', {class: 'data-flex'}], 
        [
          build(['img', { src: `${basePath('assets/star-icon.svg')}`, class: 'star-icon', alt: 'star icon' }]),
          build(['span'], [repoStars])
        ]),
      ]),
      repo['language'] && build(['p', {class: 'prog-lang'}], [repo['language']]),
      repo['description'] && build(['p'], [repo['description']]),
    ]);

    return listItem;
  });

  const section = build(['section', { class: 'repos' }], 
  [
    build(['h2'], ['Popular repositories']),
    build(['ul'], [...repos])
  ]);
  
  return section;
}