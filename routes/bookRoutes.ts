// src/controller/bookController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // atau '../lib/prisma' // Pastikan path prisma-mu benar

// ... (mungkin ada addBookController di sini) ...

// INI FUNGSI BARU-NYA (YANG SUDAH PINTAR)
export const getAllBookController = async (req: Request, res: Response) => {
  try {
    // 1. Ambil semua query params dari React (frontend)
    const {
      search,
      condition, 
      sortBy = 'title', 
      page = 1,
      limit = 10
    } = req.query;

    // 2. Konversi page dan limit ke angka
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // 3. Siapkan filter (WHERE clause) untuk Prisma
    const where: any = {};
    if (search) {
      where.title = {
        contains: String(search),
        mode: 'insensitive' 
      };
    }
    if (condition) {
      where.condition = String(condition);
    }

    // 4. Siapkan sort (ORDER BY clause) untuk Prisma
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = 'asc';
    } else if (sortBy === 'publication_year' || sortBy === 'publication_date') {
      orderBy.publication_year = 'asc'; 
    }

    // 5. Hitung total data (untuk pagination)
    const totalBooks = await prisma.book.count({ where: where });
    const totalPages = Math.ceil(totalBooks / limitNum);

    // 6. Ambil data buku dari database dengan SEMUA filter
    const books = await prisma.book.findMany({
      where: where,
      orderBy: orderBy,
      skip: skip,
      take: limitNum
    });

    // 7. Kirim respons kembali (SESUAI STRUKTUR JSON-mu)
    res.status(200).json({
      success: true,
      message: "Get all book successfully",
      data: books,
      meta: {
        page: pageNum,
        limit: limitNum,
        prev_page: pageNum > 1 ? pageNum - 1 : null,
        next_page: pageNum < totalPages ? pageNum + 1 : null
      }
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ... (fungsi controller lain: getBookDetailController, etc) ...