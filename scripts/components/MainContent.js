import { ProfileImage, ProfileName, ProfileStats, ProfileLink, ProfileBio, ProfileAdditionalInfo, ReposSection } from "./index.js";

function PopularRepos(repos) {
  if (repos.items && repos.items.length > 0) {
    const popularRepos = repos.items.slice(0, 6);
    return ReposSection(popularRepos);
  }
  return '';
}

export function MainContent(data, userRepos) {
  return `
    <header class="profile-header">
      ${ProfileImage(data)}
      <section class="profile-info">
        ${ProfileName(data)}
        ${ProfileStats(data)}
        ${ProfileLink(data)}
        ${ProfileBio(data)}
        ${ProfileAdditionalInfo(data)}
      </section>
    </header>
    ${PopularRepos(userRepos)}
  `;
}
