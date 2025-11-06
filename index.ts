import express from "express";
const cors = require("cors"); // <-- Ini udah bener

// 1. GANTI SEMUA IMPORT RUTE JADI 'REQUIRE'
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const genreRoutes = require("./routes/genreRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(express.json());

// === BLOK CORS (UDAH BENER) ===
const corsOptions = {
  origin: 'http://localhost:5173' 
};
app.use(cors(corsOptions));
// ============================================

// 2. HAPUS SEMUA '.default' DARI app.use()
// mount auth routes
app.use("/auth", authRoutes);
// mount book routes
app.use("/books", bookRoutes);

// check endpoint
app.get("/", (_, response) => {
    response.status(200).send("Server is up and running 💫");
});

// mount genre routes
app.use('/genre', genreRoutes);

// mount transaction routes
app.use('/transactions', transactionRoutes);

// === PORT (UDAH BENER) ===
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Express is running on Port ${PORT}`);
});