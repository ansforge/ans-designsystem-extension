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
const semantics = JSON.parse(fs.readFileSync('Semantics/ANS.tokens.json', 'utf-8'));

const primitiveKeys = new Set(getKeys(primitives));
const missing = [];

function checkAliases(obj) {
  for (const key in obj) {
    if (obj[key].$extensions?.['com.figma.aliasData']) {
      const alias = obj[key].$extensions['com.figma.aliasData'].targetVariableName.replace(/\//g, '.');
      if (!primitiveKeys.has(alias)) {
        missing.push(alias);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null && !obj[key].$value) {
      checkAliases(obj[key]);
    }
  }
}

checkAliases(semantics);
console.log('Missing references:', missing);
console.log('Sample of existing primitive keys:', Array.from(primitiveKeys).slice(0, 5));
