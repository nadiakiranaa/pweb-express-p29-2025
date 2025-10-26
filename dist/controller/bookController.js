"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookController = exports.updateBookController = exports.getBooksByGenreController = exports.getBookDetailController = exports.getAllBookController = exports.addBookController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const addBookController = async (req, res) => {
    const { title, writer, publisher, publicationYear, description, price, stockQuantity } = req.body;
    const genreId = req.body.genreId ?? req.body.genre_id;
    try {
        if (!genreId) {
            return res.status(400).json({
                success: false,
                message: "genreId is required",
            });
        }
        const newBook = await prisma_1.default.book.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};
exports.addBookController = addBookController;
const getAllBookController = async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
        const take = limit;
        const skip = (page - 1) * take;
        const [books, total] = await Promise.all([
            prisma_1.default.book.findMany({
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: { genre: true },
            }),
            prisma_1.default.book.count(),
        ]);
        const data = books.map((b) => ({
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
        const lastPage = Math.ceil(total / take) || 1;
        const meta = {
            page,
            limit: take,
            prev_page: page > 1 ? page - 1 : null,
            next_page: page < lastPage ? page + 1 : null,
        };
        return res.status(200).json({
            success: true,
            message: "Get all book successfully",
            data,
            meta,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};
exports.getAllBookController = getAllBookController;
const getBookDetailController = async (req, res) => {
    try {
        const bookId = req.params.book_id;
        const book = await prisma_1.default.book.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};
exports.getBookDetailController = getBookDetailController;
const getBooksByGenreController = async (req, res) => {
    try {
        const genreId = req.params.genre_id;
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
        const take = limit;
        const skip = (page - 1) * take;
        const [books, total] = await Promise.all([
            prisma_1.default.book.findMany({
                where: { genreId: genreId },
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: { genre: true },
            }),
            prisma_1.default.book.count({ where: { genreId: genreId } }),
        ]);
        const data = books.map((b) => ({
            id: b.id,
            title: b.title,
            writer: b.writer,
            publisher: b.publisher,
            description: b.description,
            genre: b.genre ? b.genre.name : null,
            publication_year: b.publicationYear,
            price: b.price,
            stock_quantity: b.stockQuantity,
        }));
        const lastPage = Math.ceil(total / take) || 1;
        const meta = {
            page,
            limit: take,
            prev_page: page > 1 ? page - 1 : null,
            next_page: page < lastPage ? page + 1 : null,
        };
        return res.status(200).json({
            success: true,
            message: "Get all book by genre successfully",
            data,
            meta,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};
exports.getBooksByGenreController = getBooksByGenreController;
const updateBookController = async (req, res) => {
    try {
        const bookId = req.params.book_id;
        const existing = await prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Book not foundd" });
        }
        const genreId = req.body.genreId ?? req.body.genre_id;
        const { title, writer, publisher, publicationYear, description, price, stockQuantity, } = req.body;
        const data = {};
        if (title !== undefined)
            data.title = title;
        if (writer !== undefined)
            data.writer = writer;
        if (publisher !== undefined)
            data.publisher = publisher;
        if (publicationYear !== undefined)
            data.publicationYear = publicationYear;
        if (description !== undefined)
            data.description = description;
        if (price !== undefined)
            data.price = price;
        if (stockQuantity !== undefined)
            data.stockQuantity = stockQuantity;
        if (genreId !== undefined)
            data.genreId = genreId;
        const updated = await prisma_1.default.book.update({ where: { id: bookId }, data });
        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: {
                id: updated.id,
                title: updated.title,
                updated_at: updated.updatedAt,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", data: null });
    }
};
exports.updateBookController = updateBookController;
const deleteBookController = async (req, res) => {
    try {
        const bookId = req.params.book_id;
        const existing = await prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        await prisma_1.default.book.delete({ where: { id: bookId } });
        return res.status(200).json({ success: true, message: "Book removed successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", data: null });
    }
};
exports.deleteBookController = deleteBookController;
//# sourceMappingURL=bookController.js.map