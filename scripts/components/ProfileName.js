import { escapeChars } from "../functions.js";

export function ProfileName(data) {
  return `<h1 class="profile-name">${escapeChars(data['name'] ? data['name'] : data['login'])}</h1>`;
}