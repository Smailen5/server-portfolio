import { Router } from 'express';
import { logUser } from '../../controllers/users/authController.js';
import { loginLimiter, validateLoginInput, handleLoginValidation } from '../../middleware/index.js';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateLoginInput,
  handleLoginValidation,
  logUser
);

export default router;
