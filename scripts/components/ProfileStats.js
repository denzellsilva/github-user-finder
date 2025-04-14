import { build } from "../build.js";
import { roundNumber } from "../functions.js";

export function ProfileStats(data) {
	return build(['ul', { class: 'profile-stats' }],
	[
		build(['li'], [`${roundNumber(data['public_repos'])} repos`]),
		build(['li'], [`${roundNumber(data['followers'])} followers`]),
		build(['li'], [`${roundNumber(data['following'])} following`]),
	]);
}