# ans-design-overrides

Cette bibliothèque centralise les **Tokens de Design de l'ANS** (Agence du Numérique en Santé) et fournit un système de surcharge (pivot) pour le **DSFR** (Système de Design de l'État Français).

## 🚀 Installation

Dans votre projet Angular, installez la bibliothèque :

```bash
npm install ans-design-overrides
```

*(Note : Si vous travaillez en local sans registre NPM, utilisez le chemin relatif vers le dossier `exportFigma`.)*

## 🛠 Intégration dans Angular

### 1. Configuration via `angular.json`

Ajoutez les fichiers CSS générés dans la section `styles` de votre fichier `angular.json` :

```json
"styles": [
  "node_modules/@gouvfr/dsfr/dist/dsfr.min.css",
  "node_modules/ans-design-overrides/pivot",
  "node_modules/ans-design-overrides/components",
  "src/styles.scss"
]
```

### 2. Import alternatif via SCSS

Si vous préférez utiliser `@import` dans votre fichier `src/styles.scss` :

```scss
@import '~ans-design-overrides/pivot';      // Mapping automatique ANS -> DSFR
@import '~ans-design-overrides/components'; // Surcharges spécifiques (Radius, Shadow, etc.)
```

## 🏗 Système de Build

La bibliothèque utilise **Style Dictionary v5** pour transformer les exports JSON de Figma en variables CSS exploitables.

### Fichiers Sources
- `ans-primitives.json` : Couleurs de base, espacements, échelles de radius primitives.
- `Semantics/ANS.tokens.json` : Tokens sémantiques (Primaire, Erreur, Alertes, etc.) mappés sur les primitives.
- `src/ans-dsfr-components.css` : Logique de surcharge visuelle (Radius forcés, ombres portées, etc.).

### Lancer le build
```bash
npm run build
```
Ce script génère les fichiers dans le dossier `build/css/`.

## 📦 Architecture des Tokens

- **Primitives** (`ans-primitives.css`) : Les briques de base (ex: `--color-blue-500`).
- **Tokens** (`ans-tokens.css`) : Les variables sémantiques (ex: `--color-primary-base`).
- **Pivot** (`ans-dsfr-pivot.css`) : Le cœur du système. Il surcharge les variables natives du DSFR avec les tokens ANS (ex: `--border-plain-blue-france: var(--color-primary-base)`).
- **Components** (`ans-dsfr-components.css`) : Surcharge spécifique des composants DSFR (Boutons, Badges, Modales, Tuiles, Alertes) pour forcer les arrondis (radius) et les effets visuels ANS.

## ✅ Compatibilité Angular

Cette bibliothèque est **compatible avec toutes les versions d'Angular** (v14 à v18+) car elle repose exclusivement sur des variables CSS standard. Elle ne contient aucun composant TypeScript ou logique Angular spécifique, ce qui la rend agnostique du framework.

## 🔄 Maintenance & Mises à jour

Si l'ANS souhaite modifier les valeurs des propriétés CSS (ex: changer un radius de 56px à 40px) :

1. Modifier la valeur correspondante dans `ans-primitives.json` ou `Semantics/ANS.tokens.json`.
2. Relancer le build : `npm run build`.
3. Mettre à jour la version du package dans `package.json`.
4. Publier ou réinstaller le package dans le projet consumer.

---
*© Agence du Numérique en Santé*
