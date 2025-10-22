import { Request, Response } from 'express';
import prisma from '../config/prisma';

/**
 * Controller untuk membuat Genre baru
 * POST /genre
 */
export const CreateGenreController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Nama genre wajib diisi.'
            });
            return;
        }

    // Save genre using Prisma
    const newGenre = await prisma.genre.create({ data: { name } });

        // Struktur output sesuai permintaan
        res.status(201).json({ // 201 Created untuk POST sukses
            success: true,
            message: "Genre created successfully",
            data: {
                id: newGenre.id,
                name: newGenre.name,
                created_at: newGenre.createdAt instanceof Date ? newGenre.createdAt.toISOString() : new Date(newGenre.createdAt).toISOString()
            }
        });
    } catch (error) {
        console.error('Error creating genre:', error);
        // Tangani error lain, misalnya duplikasi nama
        if (error instanceof Error && error.message.includes('duplicate')) {
             res.status(409).json({ // 409 Conflict
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

// ... (export controller lain jika ada)
/**
 * Controller untuk mengambil semua Genre (paginated)
 * GET /genre
 */
export const GetAllGenresController = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '15'), 10);

        const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
        const safeLimit = Number.isNaN(limit) || limit < 1 ? 15 : limit;

        const skip = (safePage - 1) * safeLimit;

        // total count
        const total = await prisma.genre.count();

        // fetch paginated data
        const genres = await prisma.genre.findMany({
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
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * Controller untuk mengambil detail Genre
 * GET /genre/:genre_id
 */
export const GetGenreDetailController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genre_id } = req.params;

        if (!genre_id) {
            res.status(400).json({ success: false, message: 'genre_id is required' });
            return;
        }

        const genre = await prisma.genre.findUnique({
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
    } catch (error) {
        console.error('Error fetching genre detail:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * Controller untuk mengupdate Genre
 * PATCH /genre/:genre_id
 */
export const UpdateGenreController = async (req: Request, res: Response): Promise<void> => {
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

        const existing = await prisma.genre.findUnique({ where: { id: genre_id } });
        if (!existing) {
            res.status(404).json({ success: false, message: 'Genre tidak ditemukan' });
            return;
        }

        const updated = await prisma.genre.update({
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
    } catch (error) {
        console.error('Error updating genre:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
}

/**
 * Controller untuk menghapus Genre
 * DELETE /genre/:genre_id
 */
export const DeleteGenreController = async (req: Request, res: Response) => {
    try {
		const { genre_id } = req.params;
		const genre = await prisma.genre.findFirst({ where: { id: genre_id, deletedAt: null } });
		if (!genre) return res.status(404).json({ error: 'Genre not found' });

		// Soft delete
		await prisma.genre.update({ where: { id: genre_id }, data: { deletedAt: new Date() } });

		// Do not delete books; they remain but their genreId still points to the genre (which is soft-deleted). That's intended.

		res.json({ message: 'Genre deleted' });
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}

}


export default {}