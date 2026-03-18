// App: express server setup
import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { booksRouter } from "./routes/books.routes";
import { reviewsRouter } from "./routes/reviews.routes";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

export const app: Express = express();

// middleware
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/books", reviewsRouter);

// error handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);