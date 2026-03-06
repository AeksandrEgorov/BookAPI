import { faker } from "@faker-js/faker";
import { Publisher } from "../../models/publisher.model";
import { MOCK_COUNTS } from "./books.mock.faker";

const COUNT = MOCK_COUNTS.publishers;

function generatePublisher(id: number): Publisher {
  return {
    id,
    name: faker.company.name(),
    country: faker.location.country(),
    foundedYear: faker.number.int({ min: 1850, max: 2020 }),
    website: faker.internet.url(),
    createdAt: faker.date.past({ years: 30 }).toISOString(),
  };
}

export const publishers: Publisher[] = Array.from(
  { length: COUNT },
  (_, index) => generatePublisher(index + 1)
);
