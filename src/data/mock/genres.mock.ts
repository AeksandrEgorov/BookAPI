import { Genre } from "../../models/genre.model";
import { MOCK_COUNTS } from "./books.mock.faker";

const DEFAULT_GENRES = [
  "Fiction",
  "Non-fiction",
  "Programming",
  "Science",
  "History",
  "Fantasy",
  "Biography",
  "Philosophy",
];

const COUNT = Math.max(MOCK_COUNTS.genres, 5);

export const genres: Genre[] = Array.from({ length: COUNT }, (_, i) => ({
  id: i + 1,
  name: DEFAULT_GENRES[i] ?? `Genre ${i + 1}`,
}));
