import { Router } from "express";
import { CreateGenreController, GetAllGenresController, GetGenreDetailController, UpdateGenreController, DeleteGenreController } from '../controller/GenreController';

const router = Router();

// POST /genre -> create a new genre
router.post('/', CreateGenreController);

// GET /genre -> get all genres (paginated)
router.get('/', GetAllGenresController);

// GET /genre/:genre_id -> get genre detail
router.get('/:genre_id', GetGenreDetailController);

// PATCH /genre/:genre_id -> update genre
router.patch('/:genre_id', UpdateGenreController);

// DELETE /genre/:genre_id -> delete genre
router.delete('/:genre_id', DeleteGenreController);

export default router;
