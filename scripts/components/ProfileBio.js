export function ProfileBio(data) {
  return `${data['bio'] ? `<p class="profile-bio">${data['bio']}</p>` : ''}`;
}