import express, { Express } from "express";
import { booksRouter } from "./routes/books.routes";
import { reviewsRouter } from "./routes/reviews.routes";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

export const app: Express = express();

app.use(express.json());

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/books", reviewsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);