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
  "node_modules/@gouvfr/dsfr/dist/utility/icons/icons.min.css",
  "node_modules/@gouvfr/dsfr/dist/utility/utility.min.css",
  "node_modules/ans-design-overrides/build/css/ans-dsfr-pivot.css",
  "node_modules/ans-design-overrides/build/css/ans-dsfr-components.css",
  "src/styles.scss"
]
```

### 2. Import alternatif via SCSS

Si vous préférez utiliser `@import` dans votre fichier `src/styles.scss` :

```scss
@import 'ans-design-overrides/pivot';      // Mapping automatique ANS -> DSFR
@import 'ans-design-overrides/components'; // Surcharges spécifiques (Radius, Shadow, etc.)
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
## 👁 Aperçu des composants (Consumer App)

Pour visualiser l'effet des surcharges ANS sur les composants DSFR, vous pouvez lancer l'application de démonstration incluse dans le dossier `consumer-app/`. 

**Procédure de lancement :**
1. Allez dans le dossier : `cd consumer-app`
2. Installez les dépendances : `npm install`
3. Lancez le serveur : `npm start`
4. Accédez à : `http://localhost:4200`

Cette application contient une matrice de test complète pour les boutons, badges, modales, tuiles, alertes, et même un exemple de Header/Footer.

### 📋 Table de correspondance (PSI → ANS)

Une page de documentation interactive est également disponible pour visualiser la correspondance exacte entre les composants de l'application **PSI** et leur rendu avec le thème **ANS** (vrais composants CSS vs DSFR surchargé).

Pour y accéder :
1. Une fois l'application lancée, ouvrez : `http://localhost:4200/correspondance-ds-ans-dsfr.html`
2. Ou cliquez sur le lien en bas de page (footer) de l'application.

Consultez le [README du dossier consumer-app](consumer-app/README.md) pour plus de détails.

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
