export function ProfileBio(data) {
  return `<p class="bio">${data['bio'] ? data['bio'] : 'No bio available'}</p>`;
}