import { Router } from 'express';
import { logUser } from '../../controllers/users/authController';
import { validateLoginInput } from '../../middleware/validators';
import { handleLoginValidation } from '../../middleware/validatorsLogin';

const router = Router();

router.post('/login', validateLoginInput, handleLoginValidation, logUser);

export default router;
