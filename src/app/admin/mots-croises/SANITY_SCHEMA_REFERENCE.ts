/**
 * Sanity Studio schema to add in your Sanity Studio project.
 * Add this file to your Sanity Studio schemas/ directory and register it.
 */

const wordEntry = {
  type: 'object',
  fields: [
    { name: 'number', title: 'Numéro', type: 'number' },
    { name: 'row', title: 'Rangée (0-indexed)', type: 'number' },
    { name: 'col', title: 'Colonne (0-indexed)', type: 'number' },
    { name: 'answer', title: 'Réponse', type: 'string' },
    { name: 'clue', title: 'Indice (texte libre)', type: 'text', rows: 2 },
    {
      name: 'termReference',
      title: 'Terme du glossaire (optionnel)',
      type: 'reference',
      to: [{ type: 'glossary' }],
    },
  ],
};

export default {
  name: 'crossword',
  title: 'Mots Croisés',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    {
      name: 'difficulty',
      title: 'Difficulté',
      type: 'string',
      options: {
        list: [
          { title: 'Facile', value: 'facile' },
          { title: 'Moyen', value: 'moyen' },
          { title: 'Difficile', value: 'difficile' },
        ],
        layout: 'radio',
      },
    },
    { name: 'description', title: 'Description', type: 'text', rows: 2 },
    { name: 'publishedAt', title: 'Publié le', type: 'datetime' },
    {
      name: 'gridData',
      title: 'Données de la grille',
      type: 'object',
      fields: [
        { name: 'rows', title: 'Rangées', type: 'number' },
        { name: 'cols', title: 'Colonnes', type: 'number' },
        { name: 'across', title: 'Mots horizontaux', type: 'array', of: [wordEntry] },
        { name: 'down', title: 'Mots verticaux', type: 'array', of: [wordEntry] },
      ],
    },
  ],
};
