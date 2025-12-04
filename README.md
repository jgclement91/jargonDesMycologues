# Le jargon des mycologues / The Mycologist's Glossary

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5-black)](https://nextjs.org/)
[![Live Demo](https://img.shields.io/badge/demo-online-success)](https://www.jargon-des-mycologues.org/)

🍄 Un glossaire mycologique illustré et vulgarisé contenant plus de 1200 termes avec hyperliens, exemples et 75+ planches anatomiques détaillées.

🍄 An illustrated and accessible mycology glossary containing over 1200 terms with hyperlinks, examples, and 75+ detailed anatomical plates.

---

## À propos / About

**Français:**

Bien souvent, les glossaires de mycologie s'adressent à des initiés ou à des amateurs familiers avec le vocabulaire de la botanique, du grec ancien et du latin. Ce glossaire illustré et vulgarisé vise à combler cette lacune par l'utilisation d'un langage accessible à tous et la présentation d'exemples, de schémas et de plus de 75 planches anatomiques, dont une soixantaine se consacrent à des portraits de « famille ».

Pour pallier la difficulté des termes techniques, nous avons implanté des hyperliens à même le texte permettant d'accéder d'un simple clic aux définitions.

**English:**

Often, mycology glossaries are aimed at experts or enthusiasts familiar with botanical, ancient Greek, and Latin vocabulary. This illustrated and accessible glossary aims to bridge this gap by using language accessible to everyone and presenting examples, diagrams, and over 75 anatomical plates, including about sixty devoted to "family" portraits.

To address the difficulty of technical terms, we've implemented hyperlinks directly in the text, allowing users to access definitions with a simple click.

---

## ✨ Features

- **1200+ illustrated terms** - Comprehensive mycological vocabulary with accessible definitions
- **75+ anatomical plates** - Including 60 family portraits with detailed illustrations
- **Intelligent search** - Accent-insensitive search with real-time filtering
- **Integrated hyperlinks** - Seamlessly navigate between related terms
- **16 contextual categories** - Each term is tagged with visual icons (Classification, Ecology, Microscopy, etc.)
- **Responsive design** - Optimized for both mobile and desktop experiences
- **Alphabetical navigation** - Browse terms by letter with prefix/suffix support

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16.0 (App Router)
- **Language:** TypeScript 5.1
- **CMS:** [Sanity](https://www.sanity.io/) (Headless CMS)
- **Styling:** TailwindCSS 3.3
- **UI Components:** Radix UI
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics

---

## 📋 Prerequisites

- **Node.js** >= 22.0.0
- **npm** or **pnpm**

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/jgclement91/jargonDesMycologues.git
cd jargonDesMycologues
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment variables

⚠️ **Note on Data**: This repository contains the application code only. The mycological content is managed through Sanity CMS and is not included. You can explore the code structure and implementation, but you'll need your own Sanity project to run it locally.

Create a `.env.local` file at the root:

```env
SANITY_PROJECT_ID=your_project_id
SANITY_TOKEN=your_sanity_token
```

### 4. Run development server

```bash
npm run dev
```

The application will be available at [http://localhost:3333](http://localhost:3333)

---

## 🏗️ Building for Production

```bash
npm run build
npm run start
```

The production server will run on port 3333.

---

## 📁 Project Structure

```
src/app/
├── api/
│   └── sitemap/              # Dynamic sitemap generation
├── clients/
│   └── sanityClient.ts       # Sanity CMS client and queries
├── components/               # Shared components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx           # Main navigation
│   └── portableTextComponent.tsx  # Custom link handling
├── glossaire/                # Glossary pages
│   ├── page.tsx
│   └── [term]/page.tsx       # Dynamic term pages
├── planche/                  # Anatomical plates section
│   ├── page.tsx              # Plates list
│   └── [title]/page.tsx      # Individual plate view
└── terms/                    # Term display components
```

---

## 🤝 Contributing

Contributions are welcome! This is an independent open-source project aimed at helping the mycology community.

### How to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Guidelines:

- Follow the existing code style (TypeScript, no comments except JSDoc)
- Test your changes thoroughly
- Update documentation if needed
- Keep commits atomic and well-described

---

## 📜 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### What this means:

- ✅ **You can** use, modify, and distribute this code
- ✅ **You can** use it for commercial purposes
- ⚠️ **You must** share your modifications under the same license
- ⚠️ **You must** disclose your source code if you run it as a web service
- ⚠️ **You must** include the original copyright and license notice

This license ensures that improvements to this educational resource remain open and benefit the entire mycology community.

For more details, see the [LICENSE](./LICENSE) file or visit [GNU AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html).

---

## 👥 Credits

### Development
- **Julien Clément** - Developer & Maintainer

### Content & Glossary
- **Jean Després** - Original glossary creator
- **Patrice Dauzet** - Content contributor
- **Michèle Ledecq** - Content contributor

### In collaboration with
- **[Cercle des mycologues de Montréal](https://www.mycomontreal.qc.ca/)**

---

## 🔗 Links

- **Live Website:** [https://www.jargon-des-mycologues.org/](https://www.jargon-des-mycologues.org/)
- **Report Issues:** [GitHub Issues](https://github.com/jgclement91/jargonDesMycologues/issues)

---

🍄 Developed independently as an open-source contribution to the mycology community, in collaboration with the Cercle des mycologues de Montréal.
