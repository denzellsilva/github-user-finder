import { roundNumber, escapeChars } from "../functions.js";

export function ProfileStats(data) {
  return `
    <ul class="profile-stats">
      <li>${escapeChars(roundNumber(data['public_repos']))} repos</li>
      <li>${escapeChars(roundNumber(data['followers']))} followers</li>
      <li>${escapeChars(roundNumber(data['following']))} following</li>
    </ul>
  `;
}