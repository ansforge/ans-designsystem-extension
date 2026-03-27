import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: [
    'ans-primitives.json',
    'Semantics/ANS.tokens.json'
  ]
});

const tokens = await sd.exportPlatform('css');
console.log('Sample token filePath:', tokens.color.primary.darker.filePath);
// List all unique filePaths
const filePaths = new Set();
function traverse(obj) {
  if (obj.filePath) {
    filePaths.add(obj.filePath);
  } else {
    for (const key in obj) {
      if (typeof obj[key] === 'object') traverse(obj[key]);
    }
  }
}
traverse(tokens);
console.log('Unique filePaths found:', Array.from(filePaths));
