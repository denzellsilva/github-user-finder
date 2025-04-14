import { build } from '../build.js';

export function ProfileAdditionalInfo(data) {
	return build(['ul'], 
	[

		data['location'] && build(['li'], 
		[
			`Location: ${data['location']}`
		]),

		data['company'] && build(['li'], 
		[
			`Company: ${data['company']}`,
		]),

		data['blog'] && build(['li'], 
		[
			'Blog: ', build(['a', { href: data['blog'], target: 'blank' }], [data['blog']]),
		]),

		data['twitter_username'] && build(['li'], 
		[
			'Twitter: ', build(['a', { href: `https://x.com/${data['twitter_username']}`, target: 'blank' }], [data['twitter_username'],]),
		]),

	]);
}