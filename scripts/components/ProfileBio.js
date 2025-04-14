import { build } from "../build.js";

export function ProfileBio(data) {
  return build(['p'], [data['bio']]);
}