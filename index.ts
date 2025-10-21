import express from "express";
import genreRoutes from './routes/genreRoutes';
// import transactionRoutes from './routes/transactionRoutes';

const app = express();

app.use(express.json());

// check endpoint
app.get("/", (_, response) => {
	response.status(200).send("Server is up and running 💫");
});

// mount genre routes
app.use('/genre', genreRoutes);

// app.use('/transactions', transactionRoutes);

const PORT = 4000;
app.listen(PORT, () => {
	console.log(`Express is running on Port ${PORT}`);
});