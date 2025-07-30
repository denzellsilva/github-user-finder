import { escapeChars } from "../functions.js";

export function ProfileLink(data) {
  return `
    <h2 class="profile-link">
      <a href="https://github.com/${data['login']}" target="_blank" rel="noopener noreferrer">@${escapeChars(data['login'])}</a>
    </h2>
  `;
}