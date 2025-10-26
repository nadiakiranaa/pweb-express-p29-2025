"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GenreController_1 = require("../controller/GenreController");
const router = (0, express_1.Router)();
router.post('/', GenreController_1.CreateGenreController);
router.get('/', GenreController_1.GetAllGenresController);
router.get('/:genre_id', GenreController_1.GetGenreDetailController);
router.patch('/:genre_id', GenreController_1.UpdateGenreController);
router.delete('/:genre_id', GenreController_1.DeleteGenreController);
exports.default = router;
//# sourceMappingURL=genreRoutes.js.map