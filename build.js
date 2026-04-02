import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import path from 'path';

// Fonction utilitaire pour convertir Hex + Alpha en RGBA
function hexToRgba(hex, alpha) {
  if (!hex) return 'transparent';
  if (alpha === undefined || alpha === 1) return hex;
  
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Fonction pour prétraiter les tokens
function preprocessTokens(filePath, allAvailableKeys) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const traverse = (obj, p = '') => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const currentPath = p ? `${p}.${key}` : key;
        
        if (obj[key].$value !== undefined) {
          const value = obj[key].$value;
          const extensions = obj[key].$extensions || {};
          const aliasData = extensions['com.figma.aliasData'];

          // 1. Résolution de l'alias Figma
          if (aliasData) {
            const alias = aliasData.targetVariableName.replace(/\//g, '.');
            if (allAvailableKeys.has(alias) && alias !== currentPath) {
              obj[key].$value = `{${alias}}`;
              continue; 
            }
          }

          // 2. Traitement des valeurs brutes
          // On transforme tout en string déjà formatée pour éviter les transforms de SD
          if (obj[key].$type === 'color' || currentPath.includes('color')) {
            if (typeof value === 'object' && value.hex) {
              obj[key].$value = hexToRgba(value.hex, value.alpha);
            }
          } 
          else if (obj[key].$type === 'number' || typeof value === 'number') {
            const isDimension = currentPath.includes('radius') || 
                               currentPath.includes('shadow') || 
                               currentPath.includes('border') || 
                               currentPath.includes('size');
            
            if (isDimension && value !== 0) {
              obj[key].$value = `${value}px`;
            }
          }
          // On change le type en string pour que SD n'y touche plus
          obj[key].$type = 'other'; 
        } else {
          traverse(obj[key], currentPath);
        }
      }
    }
  };
  traverse(content);
  return content;
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (obj[key].$value !== undefined) {
      keys.push(newPrefix);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], newPrefix));
    }
  }
  return keys;
}

// Sépare un objet de tokens prétraités en deux groupes :
// - raw : tokens à valeur brute (pas d'alias) → iront dans les primitives
// - ref : tokens aliasés avec {path} → resteront dans le pivot
function separateRawAndRef(obj) {
  const raw = {};
  const ref = {};
  for (const key in obj) {
    if (obj[key].$value !== undefined) {
      const isRef = typeof obj[key].$value === 'string' && obj[key].$value.startsWith('{');
      (isRef ? ref : raw)[key] = obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      const { raw: childRaw, ref: childRef } = separateRawAndRef(obj[key]);
      if (Object.keys(childRaw).length) raw[key] = childRaw;
      if (Object.keys(childRef).length) ref[key] = childRef;
    }
  }
  return { raw, ref };
}

// Fusionne 'source' dans 'target' (deep merge, sans mutation de source)
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && source[key].$value === undefined) {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const rawPrimitives = JSON.parse(fs.readFileSync('ans-primitives.json', 'utf-8'));
const rawSemantics = JSON.parse(fs.readFileSync('Semantics/ANS.tokens.json', 'utf-8'));
const allKeys = new Set([...getAllKeys(rawPrimitives), ...getAllKeys(rawSemantics)]);

const primitives = preprocessTokens('ans-primitives.json', allKeys);
const semantics = preprocessTokens('Semantics/ANS.tokens.json', allKeys);

// Séparer les tokens sémantiques : bruts → primitives, aliasés → pivot
const { raw: semanticsRaw, ref: semanticsRef } = separateRawAndRef(semantics);
const mergedPrimitives = deepMerge(JSON.parse(JSON.stringify(primitives)), semanticsRaw);

fs.writeFileSync('tmp-primitives.json', JSON.stringify(mergedPrimitives, null, 2));
fs.writeFileSync('tmp-semantics.json', JSON.stringify(semanticsRef, null, 2));

async function build(name, sources, dest, options = {}, filter = undefined) {
  const sd = new StyleDictionary({
    source: sources,
    // Supprimer le warning "filtered out token references" (comportement intentionnel)
    log: filter ? { warnings: 'disabled' } : {},
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [{
          destination: dest,
          format: 'css/variables',
          ...(filter && { filter }),
          options: options
        }]
      }
    }
  });
  await sd.buildAllPlatforms();
  console.log(`✔ ${name} ok`);
}

console.log('Build...');
await build('Primitives', ['tmp-primitives.json'], 'ans-primitives.css');
// Pour le pivot : on charge les deux sources pour la résolution des alias,
// mais on n'émet que les tokens qui viennent du fichier sémantique.
await build(
  'Pivot',
  ['tmp-primitives.json', 'tmp-semantics.json'],
  'ans-dsfr-pivot.css',
  { outputReferences: true },
  (token) => token.filePath === 'tmp-semantics.json'
);

// Copie du fichier des surcharges spécifiques de composants (Radius, Ombres)
const srcComponents = path.join(process.cwd(), 'src/ans-dsfr-components.css');
const destComponents = path.join(process.cwd(), 'build/css/ans-dsfr-components.css');
if (fs.existsSync(srcComponents)) {
  fs.copyFileSync(srcComponents, destComponents);
  console.log(`✔ Composants DSFR : build/css/ans-dsfr-components.css`);
}

// Génération de l'orchestrateur Sass (Centralisation propre)
const indexSCSS = [
  '/* ANS Design System Extension — Centralisation des couches */',
  '',
  '@import "./ans-primitives.css";',
  '@import "./ans-dsfr-pivot.css";',
  '@import "./ans-dsfr-components.css";',
  '',
].join('\n');

const indexCSS = [
  '/* ANS Design System Extension — Orchestrateur CSS */',
  '',
  '@import "./ans-primitives.css";',
  '@import "./ans-dsfr-pivot.css";',
  '@import "./ans-dsfr-components.css";',
  '',
].join('\n');

fs.writeFileSync(path.join(process.cwd(), 'build/css/index.css'), indexCSS, 'utf-8');
console.log('✔ index.scss et index.css générés (orchestrateurs)');

fs.unlinkSync('tmp-primitives.json');
fs.unlinkSync('tmp-semantics.json');
console.log('Fini !');
