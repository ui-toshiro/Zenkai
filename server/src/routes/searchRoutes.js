import express from 'express';
import { unifiedSearch } from '../controllers/unifiedSearchController.js';

const router = express.Router();

router.get('/unified', unifiedSearch);

export default router;
