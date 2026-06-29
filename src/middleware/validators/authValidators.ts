import { body } from 'express-validator';

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
    .isLength({ min: 6 })
    .withMessage('La password deve essere di almeno 6 caratteri'),
];
