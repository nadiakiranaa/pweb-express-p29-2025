// src/controller/bookController.ts (KODE FULL + PERBAIKAN)

import { Request, Response } from "express";
// 1. IMPORT PRISMA-MU (Ini udah bener, JANGAN DIUBAH)
import prisma from "../config/prisma"; 

// == INI FUNGSI ASLI KAMU (addBookController) - AMAN ==
export const addBookController = async (req: Request, res: Response) => {
    const { title, writer, publisher, publicationYear, description, price } = req.body;
    const stockQuantity = req.body.stockQuantity ?? req.body.stock_quantity;
    const genreId = req.body.genreId ?? req.body.genre_id;

    try {
        if (!genreId) {
            return res.status(400).json({
                success: false,
                message: "genreId is required",
            });
        }
        const newBook = await prisma.book.create({
            data: {
                title,
                writer: writer || "",
                publisher: publisher || "",
                publicationYear: publicationYear || 0,
                description: description || null,
                price: price || 0,
                stockQuantity: stockQuantity || 0,
                genreId: genreId,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: {
                id: newBook.id,
                title: newBook.title,
                created_at: newBook.createdAt,
            },
        });
    } catch (error: any) { // <-- 1. PERBAIKAN KECIL (tambah ': any')
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message
        });
    }
};

// == INI FUNGSI YANG KITA GANTI (getAllBookController) ==
export const getAllBookController = async (req: Request, res: Response) => {
    try {
        // 1. Ambil SEMUA query params
        const {
            search,
            sortBy = 'title', 
            page: pageQuery,
            limit: limitQuery
        // 2. INI PERBAIKAN UTAMANYA (tambah 'as any')
        } = req.query as any; 

        // 2. Logika pagination-mu (sudah benar)
        const page = parseInt((pageQuery as string) || "1", 10);
        const limit = parseInt((limitQuery as string) || "5", 10);
        const take = limit;
        const skip = (page - 1) * take;

        // 3. Siapkan filter (WHERE clause) untuk Prisma
        const where: any = {};
        if (search) {
            where.title = {
                contains: String(search),
                mode: 'insensitive' // Gak peduli huruf besar/kecil
            };
        }

        // 4. Siapkan sort (ORDER BY clause) untuk Prisma
        const orderBy: any = {};
        if (sortBy === 'title') {
            orderBy.title = 'asc'; // Urutkan Judul A-Z
        } else if (sortBy === 'publication_year' || sortBy === 'publication_date') {
            orderBy.publicationYear = 'asc'; 
        } else {
            orderBy.createdAt = 'desc';
        }

        // 5. Hitung total dan ambil data (DENGAN FILTER)
        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where: where,       // <-- DITERAPKAN DI SINI
                skip,
                take,
                orderBy: orderBy,   // <-- DITERAPKAN DI SINI
                include: { genre: true },
            }),
            prisma.book.count({ where: where }), // <-- 'where' juga di sini
        ]);

        // 6. Logika mapping-mu (sudah benar)
        const data = books.map((b: any) => ({
            id: b.id,
            title: b.title,
            writer: b.writer,
            publisher: b.publisher,
            description: b.description,
            publication_year: b.publicationYear,
            price: b.price,
            stock_quantity: b.stockQuantity,
            genre: b.genre ? b.genre.name : null,
        }));

        // 7. Logika meta-mu (sudah benar)
        const lastPage = Math.ceil(total / take) || 1;
        const meta = {
            page,
            limit: take,
            prev_page: page > 1 ? page - 1 : null,
            next_page: page < lastPage ? page + 1 : null,
        };

        // 8. Kirim respons (Error 'res.status' palsu akan hilang)
        return res.status(200).json({
            success: true,
            message: "Get all book successfully",
            data,
            meta,
        });
    } catch (error: any) { // <-- 1. PERBAIKAN KECIL (tambah ': any')
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message
        });
    }
};

// == INI FUNGSI ASLI KAMU (getBookDetailController) - AMAN ==
export const getBookDetailController = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.book_id;
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: { genre: true },
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get book detail successfully",
            data: {
                id: book.id,
                title: book.title,
                writer: book.writer,
                publisher: book.publisher,
                description: book.description,
                publication_year: book.publicationYear,
                price: book.price,
                stock_quantity: book.stockQuantity,
                genre: book.genre ? book.genre.name : null,
            },
        });
    } catch (error: any) { // <-- 1. PERBAIKAN KECIL (tambah ': any')
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message
        });
    }
};

export const getBooksByGenreController = async (req: Request, res: Response) => {
    try {
        const genreId = req.params.genre_id;
        const page = parseInt((req.query.page as string) || "1", 10);
        const limit = parseInt((req.query.limit as string) || "5", 10);
        const take = limit;
        const skip = (page - 1) * take;

        const [books, total] = await Promise.all([
            // 👇 ISI INI JANGAN DIHAPUS 👇
            prisma.book.findMany({
                where: { genreId: genreId },
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: { genre: true },
            }), // <--- KOMA-nya di sini
            // -----------------------------
            prisma.book.count({ where: { genreId: genreId } }),
        ]);

        // ... (sisa kode mapping-mu) ...
        const data = books.map((b: any) => ({
            // ...
        }));
        
        // ... (sisa kode meta-mu) ...
        const meta = {
            // ...
        };

        return res.status(200).json({
            // ...
        });
    } catch (error: any) {
        // ...
    }
};