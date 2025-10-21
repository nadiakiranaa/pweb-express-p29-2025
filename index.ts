// src/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Impor rute-rute
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes'; // Menggantikan 'library' untuk konsistensi
import genreRoutes from './routes/genreRoutes';
import transactionRoutes from './routes/transactionRoutes'; // Menggantikan 'transaction' untuk konsistensi

// Inisialisasi dotenv untuk membaca file .env
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Ekspor instance Prisma agar bisa diimpor di file lain jika perlu
export const prisma = new PrismaClient();

// Middleware untuk parsing body JSON dari request
app.use(express.json());

// Rute dasar untuk mengecek apakah server berjalan
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API Server Toko Buku sedang berjalan...' });
});

// Gunakan Rute yang sudah diimpor
// Awalan '/api' adalah praktik umum untuk versioning atau namespacing
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); // Rute untuk 'library' atau buku
app.use('/api/genres', genreRoutes);
app.use('/api/orders', transactionRoutes); // Rute untuk 'transaction' atau pesanan

// Jalankan server
app.listen(PORT, () => {
  console.log(`[server]: Server berjalan di http://localhost:${PORT}`);
});