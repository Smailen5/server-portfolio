import { body, param } from "express-validator";

// Validazione per la creazione di un progetto
export const createProjectValidator = [
  body("name")
    .notEmpty()
    .withMessage("Il nome è obbligatorio")
    .isString()
    .withMessage("Il nome deve essere una stringa"),
  body("link")
    .notEmpty()
    .withMessage("Il link è obbligatorio")
    .isURL()
    .withMessage("Il link deve essere un URL valido"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("Le immagini devono essere un array non vuoto"),
  body("images.*")
    .isURL()
    .withMessage("Ogni immagine deve essere un URL valido"),
  body("technologies")
    .isArray()
    .withMessage("Le tecnologie devono essere un array")
    .notEmpty()
    .withMessage("Almeno una tecnologia è obbligatoria"),
  body("description")
    .notEmpty()
    .withMessage("La descrizione è obbligatoria")
    .isString()
    .withMessage("La descrizione deve essere una stringa"),
];

// Validazione per l'aggiornamento di un progetto
export const updateProjectValidator = [
  param("id").isMongoId().withMessage("ID non valido"),
  body("name")
    .optional()
    .isString()
    .withMessage("Il nome deve essere una stringa"),
  body("link")
    .optional()
    .isURL()
    .withMessage("Il link deve essere un URL valido"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Le immagini devono essere un array"),
  body("images.*")
    .optional()
    .isURL()
    .withMessage("Ogni immagine deve essere un URL valido"),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Le tecnologie devono essere un array"),
  body("description")
    .optional()
    .isString()
    .withMessage("La descrizione deve essere una stringa"),
];

// Validazione per l'ID (usato in GET e DELETE)
export const idValidator = [
  param("id").isMongoId().withMessage("ID non valido"),
];
