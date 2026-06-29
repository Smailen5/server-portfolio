import { header } from 'express-validator';

// Validazione per la sincronizzazione dei progetti
export const syncValidator = [
  header('x-api-key')
    .notEmpty()
    .withMessage('La chiave API è necessaria')
    .isString()
    .withMessage('La chiave API deve essere una stringa')
    .isLength({ min: 20, max: 20 })
    .withMessage('La chiave API deve essere di 20 caratteri')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{20}$/)
    .withMessage(
      'La chiave API deve contenere lettere maiuscole, minuscole e numeri'
    ),
];
