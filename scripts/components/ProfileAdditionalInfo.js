import { build } from '../build.js';
import { basePath } from '../functions.js';

export function ProfileAdditionalInfo(data) {
  return build(['ul', { class: 'additional-info' }], 
  [
    data['location'] && build(['li'], 
    [
      build(['img', { src: `${basePath('/assets/location-icon.svg')}`, alt: 'Location: '}]),
      build(['span'], [data['location']])
    ]),

    data['company'] && build(['li'], 
    [
      build(['img', { src: `${basePath('/assets/building-icon.svg')}`, alt: 'Company: '}]),
      build(['span'], [data['company']])
    ]),

    data['blog'] && build(['li'], 
    [
      build(['img', { src: `${basePath('/assets/link-icon.svg')}`, alt: 'Blog: '}]),
      build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
    ]),

    data['twitter_username'] && build(['li'], 
    [
      build(['img', { src: `${basePath('/assets/twitter-icon.svg')}`, alt: 'Company: '}]),
      build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username']]),
    ]),
  ]);
}