import express from 'express';
import {
  createTransaction,
  createTransactionNoAuth,
  getAllTransactions,
  getTransactionById,
  getTransactionStats
} from '../controller/TransactionController';

const router = express.Router();

// Test create transaction WITHOUT auth (local testing only)
router.post('/test', createTransactionNoAuth);

// Create new transaction (requires Authorization header)
router.post('/', createTransaction);

// Get all transactions with pagination, search, and sorting
router.get('/', getAllTransactions);

// Get transaction statistics (must be before /:id route)
router.get('/statistics', getTransactionStats);

// Get transaction by ID
router.get('/:id', getTransactionById);

export default router;
