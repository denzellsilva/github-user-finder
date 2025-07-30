import { roundNumber } from "../functions.js";

export function ProfileStats(data) {
  return `
    <ul class="profile-stats">
      <li>${roundNumber(data['public_repos'])} repos</li>
      <li>${roundNumber(data['followers'])} followers</li>
      <li>${roundNumber(data['following'])} following</li>
    </ul>
  `;
}