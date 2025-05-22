import { body, header, param } from 'express-validator';

// Validazione per la creazione di un progetto
export const createProjectValidator = [
  body('name')
    .notEmpty()
    .withMessage('Il nome è obbligatorio')
    .isString()
    .withMessage('Il nome deve essere una stringa'),
  body('link')
    .notEmpty()
    .withMessage('Il link è obbligatorio')
    .isURL()
    .withMessage('il link deve essere un URL valido'),
  body('image')
    .notEmpty()
    .withMessage("L'immagine è obbligatoria")
    .isURL()
    .withMessage("L'immagine deve essere un URL valido"),
  body('technologies')
    .isArray()
    .withMessage('Le tecnologie devono essere un array')
    .notEmpty()
    .withMessage('Almeno una tecnologia e obbligatoria'),
  body('description')
    .notEmpty()
    .withMessage('La descrizione è obbligatoria')
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
  header('x-api-key')
    .notEmpty()
    .withMessage('La chiave API è necessaria')
    .isString()
    .withMessage('La chiave API deve essere una stringa'),
];

// Validazione utente
export const validateLoginInput = [
  body('email')
    .notEmpty()
    .withMessage("L'email è obbligatoria")
    .isEmail()
    .withMessage("Inserisci un'email valida")
    .normalizeEmail()
    .toLowerCase(),
  body('password')
    .notEmpty()
    .withMessage('La password è obbligatoria')
    .isLength({ min: 8 })
    .withMessage('La password deve essere di almeno 8 caratteri')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      'La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale'
    ),
];
