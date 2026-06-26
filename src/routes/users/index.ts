import { Router } from 'express';
import { logUser } from '../../controllers/users/authController.js';
import { loginLimiter } from '../../middleware/rateLimiter.js';
import { validateLoginInput } from '../../middleware/validators/validators.js';
import { handleLoginValidation } from '../../middleware/validators/validatorsLogin.js';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateLoginInput,
  handleLoginValidation,
  logUser
);

export default router;
