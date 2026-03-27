import { faker } from "@faker-js/faker";
import { Author } from "../../models/author.model.js";
import { MOCK_COUNTS } from "./books.mock.faker.js";

const COUNT = MOCK_COUNTS.authors;

function generateAuthor(id: number): Author {
  return {
    id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    birthYear: faker.number.int({ min: 1940, max: 2000 }),
    nationality: faker.location.country(),
    biography: faker.lorem.sentences(2),
    createdAt: faker.date.past({ years: 30 }).toISOString(),
  };
}

export const authors: Author[] = Array.from(
  { length: COUNT },
  (_, index) => generateAuthor(index + 1)
);
