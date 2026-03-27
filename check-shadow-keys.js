import fs from 'fs';

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (obj[key].$value !== undefined) {
      keys.push(newPrefix);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], newPrefix));
    }
  }
  return keys;
}

const primitives = JSON.parse(fs.readFileSync('ans-primitives.json', 'utf-8'));
const primitiveKeys = getKeys(primitives);

console.log('Shadow keys found:');
console.log(primitiveKeys.filter(k => k.startsWith('shadow')));
