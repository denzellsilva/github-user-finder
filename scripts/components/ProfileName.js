export function ProfileName(data) {
  return `<h1 class="profile-name">${data['name'] ? data['name'] : data['login']}</h1>`;
}