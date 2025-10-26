"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controller/bookController");
const bookController_2 = require("../controller/bookController");
const router = (0, express_1.Router)();
router.post("/", bookController_1.addBookController);
router.get("/", bookController_2.getAllBookController);
router.get("/:book_id", bookController_2.getBookDetailController);
router.get("/genre/:genre_id", bookController_2.getBooksByGenreController);
router.patch("/:book_id", bookController_2.updateBookController);
router.delete("/:book_id", bookController_2.deleteBookController);
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map