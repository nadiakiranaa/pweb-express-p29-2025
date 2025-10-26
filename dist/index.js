"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const genreRoutes_1 = __importDefault(require("./routes/genreRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/auth", authRoutes_1.default);
app.use("/books", bookRoutes_1.default);
app.get("/", (_, response) => {
    response.status(200).send("Server is up and running 💫");
});
app.use('/genre', genreRoutes_1.default);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Express is running on Port ${PORT}`);
});
//# sourceMappingURL=index.js.map