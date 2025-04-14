import { build } from '../build.js';

export function ProfileName(data) {
  return build(['header'], 
  [
    build(['h1'], [data['name']])
  ]);
}