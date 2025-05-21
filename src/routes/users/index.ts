import { Router } from 'express';
import { logUser } from '../../controllers/users/authController';
import { validateLoginInput } from '../../middleware/validators';
import { handleLoginValidation } from '../../middleware/validatorsLogin';
import { loginLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, validateLoginInput, handleLoginValidation, logUser);

export default router;
