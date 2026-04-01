# ans-designsystem-extension

Surcharge CSS du **DSFR** (Système de Design de l'État) aux couleurs de l'**ANS** (Agence du Numérique en Santé).

Cette bibliothèque transforme les tokens de design exportés depuis Figma en variables CSS qui se superposent au DSFR standard. Le résultat : les composants DSFR conservent leur structure HTML et leur accessibilité, mais adoptent l'identité visuelle ANS (couleurs, arrondis, ombres).

---

## Prérequis

| Dépendance | Version testée | Obligatoire |
|------------|---------------|-------------|
| Node.js | >= 18 | Oui (build) |
| `@gouvfr/dsfr` | **1.14.x** | Oui (runtime) |

> **Important** : cette bibliothèque a été conçue et testée avec le DSFR **1.14.4**.
> La compatibilité avec des versions antérieures ou postérieures du DSFR n'est **pas garantie**.
> En cas de montée de version DSFR, il faut revérifier le rendu de chaque composant surchargé.

---

## Installation

```bash
npm install ans-designsystem-extension
```

---

## Intégration dans un projet

### Option A : via `angular.json` (recommandé)

Ajoutez les CSS dans la section `styles`, **dans cet ordre** :

```json
"styles": [
  "node_modules/@gouvfr/dsfr/dist/dsfr.min.css",
  "node_modules/@gouvfr/dsfr/dist/utility/icons/icons.min.css",
  "node_modules/@gouvfr/dsfr/dist/utility/utility.min.css",
  "node_modules/ans-designsystem-extension/build/css/ans-dsfr-pivot.css",
  "node_modules/ans-designsystem-extension/build/css/ans-dsfr-components.css",
  "src/styles.scss"
]
```

L'ordre est important : les fichiers ANS doivent être chargés **après** le DSFR pour que les surcharges s'appliquent.

### Option B : via SCSS

```scss
@use 'ans-designsystem-extension/pivot';
@use 'ans-designsystem-extension/components';
```

### Frameworks non-Angular

La bibliothèque ne contient que du CSS pur (variables custom properties). Elle fonctionne avec n'importe quel framework (React, Vue, HTML statique...) du moment que le DSFR est chargé avant. Adaptez le mécanisme d'import à votre stack.

---

## Que contient le package ?

Le build produit **3 fichiers CSS** dans `build/css/` :

```
build/css/
  ans-primitives.css         66 variables   Valeurs brutes (couleurs hex, ombres, fonts)
  ans-dsfr-pivot.css        200 variables   Mapping ANS -> noms DSFR
  ans-dsfr-components.css    ~190 lignes    Surcharges de composants (radius, box-shadow)
```

### 1. Primitives (`ans-primitives.css`)

Les valeurs de base extraites de Figma. Elles ne sont pas directement utilisées par le DSFR, mais servent de référence aux deux autres couches.

```css
--color-primary-base: #1D71B8;
--color-neutral-gray-800: #50546D;
--shadow-center-strong-blur: 40px;
```

### 2. Pivot (`ans-dsfr-pivot.css`)

C'est **le fichier principal**. Il redéfinit les variables CSS natives du DSFR avec les valeurs ANS. C'est ce qui fait que les composants DSFR changent de couleur sans modifier leur HTML.

```css
/* Le DSFR lit --background-action-high-blue-france pour ses boutons primaires */
/* Le pivot redirige cette variable vers la couleur primaire ANS */
--background-action-high-blue-france: var(--color-primary-base);
--border-plain-blue-france: var(--color-primary-base);
--text-action-high-blue-france: var(--color-primary-base);
```

### 3. Components (`ans-dsfr-components.css`)

Le DSFR n'expose pas tout via des variables CSS. Certaines propriétés visuelles (border-radius, box-shadow composées) doivent être surchargées directement sur les sélecteurs CSS des composants.

Composants concernés :
- **Boutons** (`.fr-btn`) : radius asymétriques (0 en haut-gauche, arrondi ailleurs)
- **Badges** (`.fr-badge`) : radius asymétriques
- **Alertes** (`.fr-alert`) : radius + bordure colorée sur 4 côtés
- **Inputs / Selects** (`.fr-input`, `.fr-select`) : radius 16px + bordure box-shadow
- **Tuiles** (`.fr-tile`) : radius asymétriques + suppression de l'underline hover
- **Modales** (`.fr-modal__body`) : radius 56px desktop / 24px mobile + ombre "lifted"
- **Liens** (`.fr-link`) : transition opacity au hover

---

## Consumer App (demo et test)

Une application Angular de démonstration est incluse dans `consumer-app/`. Elle affiche les 14 composants surchargés dans toutes leurs variantes (tailles, états, icônes).

```bash
cd consumer-app
npm install
npm start
# -> http://localhost:4200
```

### Table de correspondance visuelle

Accessible depuis le footer de l'app ou directement :

```
http://localhost:4200/correspondance-ds-ans-dsfr.html
```

Cette page montre côte à côte le rendu de chaque composant dans 3 versions :
- **DS ANS** (ancien design system PSI)
- **DSFR** (standard, sans modification)
- **DSFR + ANS** (DSFR surchargé avec cette bibliothèque)

---

## Modifier les tokens (mise a jour visuelle)

Si vous devez changer une couleur, un arrondi, ou toute autre valeur de design :

### 1. Identifier le fichier source

| Je veux modifier... | Fichier à éditer |
|---------------------|-----------------|
| Une couleur de base (ex: bleu primaire) | `ans-primitives.json` |
| Un mapping sémantique (ex: couleur d'erreur) | `Semantics/ANS.tokens.json` |
| Un radius, une ombre, un style de composant | `src/ans-dsfr-components.css` |

### 2. Ré-exporter depuis Figma (si applicable)

Les fichiers JSON proviennent d'un export Figma (plugin Variables). Si la modification vient du design :
1. Exporter les nouvelles variables depuis Figma
2. Remplacer `ans-primitives.json` et/ou `Semantics/ANS.tokens.json`

### 3. Rebuilder

```bash
npm run build
```

### 4. Vérifier

```bash
# Vérifier que les alias Figma pointent vers des primitives existantes
node check-references.js

# Inspecter les clés de shadow
node check-shadow-keys.js

# Lancer la consumer-app pour vérification visuelle
cd consumer-app && npm start
```

### 5. Publier

```bash
# Mettre a jour la version
npm version patch   # ou minor / major selon le changement

# Publier
npm publish
```

---

## Structure du repo

```
ans-designsystem-extension/
  ans-primitives.json            Tokens primitifs Figma (couleurs, ombres, fonts)
  dsfr-primitives.json           Primitifs DSFR (reference uniquement, pas utilise au build)
  Semantics/
    ANS.tokens.json              Tokens semantiques ANS (alias vers primitifs)
    DSFR-light.tokens.json       Tokens semantiques DSFR (reference uniquement)
  src/
    ans-dsfr-components.css      Surcharges CSS manuelles par composant
  build.js                       Script de build (Style Dictionary v5)
  check-references.js            Validation : alias Figma -> primitives
  check-shadow-keys.js           Validation : structure des tokens shadow
  build/css/                     Sortie du build (3 fichiers CSS)
  consumer-app/                  App Angular de demo/test
  correspondance-ds-ans-dsfr.html  Table de correspondance visuelle
```

---

## Ce que cette bibliothèque ne fait PAS

- Elle ne modifie **aucune structure HTML** du DSFR. Le balisage DSFR standard (`class="fr-btn"`, `class="fr-alert"`, etc.) reste identique.
- Elle ne contient **aucun JavaScript**. Tout repose sur des variables CSS.
- Elle ne gère **pas le mode sombre** (dark mode). Seul le thème clair ANS est implémenté.
- Elle ne couvre **pas tous les composants** du DSFR. Seuls les 7 composants listés ci-dessus (Boutons, Badges, Alertes, Inputs/Selects, Tuiles, Modales, Liens) sont surchargés au niveau CSS. Les autres composants DSFR héritent uniquement des changements de couleurs via le pivot.

---

## Limites connues

- Le build Style Dictionary produit un warning de "token collision" (1 occurrence). C'est un effet de bord de la structure des tokens, sans impact fonctionnel.
- Les tokens `radius.*` et `fontWeight.*` dans les sémantiques n'ont pas de correspondance dans les primitives. Les valeurs brutes sont utilisées en fallback. `check-references.js` les signale.
- Les valeurs alpha des couleurs transparentes ont une précision IEEE excessive (`0.10000000149011612` au lieu de `0.1`). Aucun impact visuel.

---

*Agence du Numérique en Santé*
