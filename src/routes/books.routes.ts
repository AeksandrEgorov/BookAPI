import { Router } from "express";
import * as bookController from "../controllers/books.controller.js";

const router = Router();

router.get("/books", bookController.getAllBooks);
router.post("/books", bookController.createBook);

export default router;