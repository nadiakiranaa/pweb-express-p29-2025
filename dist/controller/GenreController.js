"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGenreController = exports.UpdateGenreController = exports.GetGenreDetailController = exports.GetAllGenresController = exports.CreateGenreController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const CreateGenreController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Nama genre wajib diisi.'
            });
            return;
        }
        const newGenre = await prisma_1.default.genre.create({ data: { name } });
        res.status(201).json({
            success: true,
            message: "Genre created successfully",
            data: {
                id: newGenre.id,
                name: newGenre.name,
                created_at: newGenre.createdAt instanceof Date ? newGenre.createdAt.toISOString() : new Date(newGenre.createdAt).toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error creating genre:', error);
        if (error instanceof Error && error.message.includes('duplicate')) {
            res.status(409).json({
                success: false,
                message: "Genre dengan nama ini sudah ada."
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Gagal membuat genre. Terjadi kesalahan server.'
        });
    }
};
exports.CreateGenreController = CreateGenreController;
const GetAllGenresController = async (req, res) => {
    try {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '15'), 10);
        const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
        const safeLimit = Number.isNaN(limit) || limit < 1 ? 15 : limit;
        const skip = (safePage - 1) * safeLimit;
        const total = await prisma_1.default.genre.count();
        const genres = await prisma_1.default.genre.findMany({
            skip,
            take: safeLimit,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true },
        });
        const lastPage = Math.max(1, Math.ceil(total / safeLimit));
        res.status(200).json({
            success: true,
            message: 'Get all genre successfully',
            data: genres,
            meta: {
                page: safePage,
                limit: safeLimit,
                prev_page: safePage > 1 ? safePage - 1 : null,
                next_page: safePage < lastPage ? safePage + 1 : null,
            },
        });
    }
    catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.GetAllGenresController = GetAllGenresController;
const GetGenreDetailController = async (req, res) => {
    try {
        const { genre_id } = req.params;
        if (!genre_id) {
            res.status(400).json({ success: false, message: 'genre_id is required' });
            return;
        }
        const genre = await prisma_1.default.genre.findUnique({
            where: { id: genre_id },
            select: { id: true, name: true },
        });
        if (!genre) {
            res.status(404).json({ success: false, message: 'Genre not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Get genre detail successfully',
            data: genre,
        });
    }
    catch (error) {
        console.error('Error fetching genre detail:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.GetGenreDetailController = GetGenreDetailController;
const UpdateGenreController = async (req, res) => {
    try {
        const { genre_id } = req.params;
        const { name } = req.body;
        if (!genre_id) {
            res.status(400).json({ success: false, message: 'genre_id diperlukan' });
            return;
        }
        if (!name) {
            res.status(400).json({ success: false, message: 'Nama genre wajib diisi.' });
            return;
        }
        const existing = await prisma_1.default.genre.findUnique({ where: { id: genre_id } });
        if (!existing) {
            res.status(404).json({ success: false, message: 'Genre tidak ditemukan' });
            return;
        }
        const updated = await prisma_1.default.genre.update({
            where: { id: genre_id },
            data: { name },
        });
        res.status(200).json({
            success: true,
            message: 'Genre updated successfully',
            data: {
                id: updated.id,
                name: updated.name,
                updated_at: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : new Date(updated.updatedAt).toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Error updating genre:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};
exports.UpdateGenreController = UpdateGenreController;
const DeleteGenreController = async (req, res) => {
    try {
        const { genre_id } = req.params;
        const genre = await prisma_1.default.genre.findFirst({ where: { id: genre_id, deletedAt: null } });
        if (!genre)
            return res.status(404).json({ error: 'Genre not found' });
        await prisma_1.default.genre.update({ where: { id: genre_id }, data: { deletedAt: new Date() } });
        res.json({ message: 'Genre deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.DeleteGenreController = DeleteGenreController;
exports.default = {};
//# sourceMappingURL=GenreController.js.map