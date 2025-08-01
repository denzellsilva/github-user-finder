import { basePath, escapeChars } from '../functions.js';

export function ProfileAdditionalInfo(data) {
  return `
    <ul class="additional-info">
      ${data['location'] ? `
        <li class="data-flex">
          <img src="${basePath('assets/location-icon.svg')}" class="data-icon" alt="location icon">
          <span>${escapeChars(data['location'])}</span>
        </li>
      ` : ''}
      ${data['company'] ? `
        <li class="data-flex">
          <img src="${basePath('assets/building-icon.svg')}" class="data-icon" alt="building-icon">
          <span>${escapeChars(data['company'])}</span>
        </li>
      ` : ''}
      ${data['blog'] ? `
        <li class="data-flex">
          <img src="${basePath('assets/link-icon.svg')}" class="data-icon" alt="link icon">
          <a href="${data['blog']}" target="_blank">${escapeChars(data['blog'])}</a>
        </li>
      ` : ''}
      ${data['twitter_username'] ? `
        <li class="data-flex">  
          <img src="${basePath('assets/twitter-icon.svg')}" class="data-icon" alt="twitter icon">
          <a href="https://x.com/${data['twitter_username']}" target="_blank">${escapeChars(data['twitter_username'])}</a>
        </li>
      ` : ''}
    </ul>
  `;
}
