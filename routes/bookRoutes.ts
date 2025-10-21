import { Router } from "express";
import { addBookController } from "../controller/bookController";
import { getAllBookController, getBookDetailController, getBooksByGenreController, updateBookController, deleteBookController } from "../controller/bookController";

const router = Router();

// POST / - add a new book
router.post("/", addBookController);

// GET / - get all books
router.get("/", getAllBookController);

// GET /:book_id - get book detail
router.get("/:book_id", getBookDetailController);

// GET /genre/:genre_id - get books by genre
router.get("/genre/:genre_id", getBooksByGenreController);

// PATCH /:book_id - update a book
router.patch("/:book_id", updateBookController);

// DELETE /:book_id - remove a book
router.delete("/:book_id", deleteBookController);

export default router;
