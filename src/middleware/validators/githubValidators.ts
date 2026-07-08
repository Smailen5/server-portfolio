import { header } from 'express-validator';

// Validazione per la sincronizzazione dei progetti
export const syncValidator = [
  header('x-api-key')
    .notEmpty()
    .withMessage('La chiave API è necessaria')
    .isString()
    .withMessage('La chiave API deve essere una stringa')
    .isLength({ min: 16, max: 64 })
    .withMessage('Chiave API non valida')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{16,64}$/)
    .withMessage('Chiave API non valida'),
];
