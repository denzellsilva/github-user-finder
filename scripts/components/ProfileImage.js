import { build } from '../build.js';

export function ProfileImage(data) {
  return build(['img', { src: data['avatar_url'], class: 'profile-img', alt: 'Profile Image' }]);
}