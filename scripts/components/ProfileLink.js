import { build } from '../build.js';

export function ProfileLink(data) {
  return build(['h2', { class: 'profile-link' }], 
  [ 
    build(['a', {href: `https://github.com/${data['login']}`, target: `blank`}], [`@${data['login']}`])
  ]);
}