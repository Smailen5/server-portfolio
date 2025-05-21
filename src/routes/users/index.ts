import { Router } from 'express';
import { logUser } from '../../controllers/users/authController';
import { loginLimiter } from '../../middleware/rateLimiter';
import { validateLoginInput } from '../../middleware/validators';
import { handleLoginValidation } from '../../middleware/validatorsLogin';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateLoginInput,
  handleLoginValidation,
  logUser
);

export default router;
