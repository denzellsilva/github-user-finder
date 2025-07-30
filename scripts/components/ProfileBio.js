import { escapeChars } from "../functions.js";

export function ProfileBio(data) {
  return `${data['bio'] ? `<p class="profile-bio">${escapeChars(data['bio'])}</p>` : ''}`;
}