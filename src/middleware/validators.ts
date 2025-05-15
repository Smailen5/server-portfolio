import { body, param } from 'express-validator';

// Validazione per la creazione di un progetto
export const createProjectValidator = [
  body('name')
    .notEmpty()
    .withMessage('Il nome e obbligatorio')
    .isString()
    .withMessage('Il nome deve essere una stringa'),
  body('link')
    .notEmpty()
    .withMessage('Il link e obbligatorio')
    .isURL()
    .withMessage('il link deve essere un URL valido'),
  body('image')
    .notEmpty()
    .withMessage("L'immagine e obbligatoria")
    .isString()
    .withMessage("L'immagine deve essere una stringa"),
  body('technologies')
    .isArray()
    .withMessage('Le tecnologie devono essere un array')
    .notEmpty()
    .withMessage('Almeno una tecnologia e obbligatoria'),
  body('description')
    .notEmpty()
    .withMessage('La descrizione e obbligatoria')
    .isString()
    .withMessage('La descrizione deve essere una stringa'),
];

// Validazione per l'aggiornamento di un progetto
export const updateProjectValidator = [
  param('id').isInt().withMessage('ID non valido'),
  body('name')
    .optional()
    .isString()
    .withMessage('Il nome deve essere una stringa'),
  body('link')
    .optional()
    .isURL()
    .withMessage('Il link deve essere un URL valido'),
  body('image')
    .optional()
    .isURL()
    .withMessage("L'immagine deve essere un URL valido"),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Le tecnologie devono esser un array'),
  body('description')
    .optional()
    .isString()
    .withMessage('La descrizione deve essere una stringa'),
];

// Validazione per l'ID (usato in GET e DELETE)
export const idValidator = [param('id').isInt().withMessage('ID non valido')];

// Validazione per la sincronizzazione dei progetti
export const syncValidator = [
  body('githubToken')
    .notEmpty()
    .withMessage('Il token GitHub e necessario')
    .isString()
    .withMessage('Il token deve essere una stringa'),
];
