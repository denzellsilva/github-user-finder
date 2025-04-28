import { build } from '../build.js';
import { basePath } from '../functions.js';

export function ProfileAdditionalInfo(data) {
  return build(['ul', { class: 'additional-info' }], 
  [
    data['location'] && build(['li', {class: 'data-flex'}], 
    [
      build(['img', { src: `${basePath('assets/location-icon.svg')}`, class: 'data-icon', alt: 'location icon'}]),
      build(['span'], [data['location']])
    ]),

    data['company'] && build(['li', {class: 'data-flex'}], 
    [
      build(['img', { src: `${basePath('assets/building-icon.svg')}`, class: 'data-icon', alt: 'building-icon'}]),
      build(['span'], [data['company']])
    ]),

    data['blog'] && build(['li', {class: 'data-flex'}], 
    [
      build(['img', { src: `${basePath('assets/link-icon.svg')}`, class: 'data-icon', alt: 'link icon'}]),
      build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
    ]),

    data['twitter_username'] && build(['li', {class: 'data-flex'}], 
    [
      build(['img', { src: `${basePath('assets/twitter-icon.svg')}`, class: 'data-icon', alt: 'twitter icon'}]),
      build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']]),
    ]),
  ]);
}