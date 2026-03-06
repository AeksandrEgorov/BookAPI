import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL as string,
	}),
});

async function main() {
	console.log("Seeding database...");

	await prisma.authorBook.deleteMany();
	await prisma.book.deleteMany();
	await prisma.author.deleteMany();

	const authors = await prisma.$transaction([
		prisma.author.create({
			data: { firstname: "Robert", lastname: "Martin" },
		}),
		prisma.author.create({
			data: { firstname: "Martin", lastname: "Fowler" },
		}),
		prisma.author.create({
			data: { firstname: "Erich", lastname: "Gamma" },
		}),
		prisma.author.create({
			data: { firstname: "Richard", lastname: "Helm" },
		}),
		prisma.author.create({
			data: { firstname: "Ralph", lastname: "Johnson" },
		}),
		prisma.author.create({
			data: { firstname: "John", lastname: "Vlissides" },
		}),
		prisma.author.create({
			data: { firstname: "Kent", lastname: "Beck" },
		}),
		prisma.author.create({
			data: { firstname: "Joshua", lastname: "Bloch" },
		}),
	]);

	const [
		robertMartin,
		martinFowler,
		erichGamma,
		richardHelm,
		ralphJohnson,
		johnVlissides,
		kentBeck,
		joshuaBloch,
	] = authors;

	const books = await prisma.$transaction([
		prisma.book.create({
			data: { title: "Clean Code", publishedYear: 2008 },
		}),
		prisma.book.create({
			data: { title: "The Pragmatic Programmer", publishedYear: 1999 },
		}),
		prisma.book.create({
			data: { title: "Refactoring", publishedYear: 1999 },
		}),
		prisma.book.create({
			data: { title: "Clean Architecture", publishedYear: 2017 },
		}),
		prisma.book.create({
			data: { title: "Design Patterns", publishedYear: 1994 },
		}),
		prisma.book.create({
			data: { title: "Test-Driven Development", publishedYear: 2002 },
		}),
		prisma.book.create({
			data: { title: "Effective Java", publishedYear: 2001 },
		}),
		prisma.book.create({
			data: { title: "Patterns of Enterprise Application Architecture", publishedYear: 2002 },
		}),
		prisma.book.create({
			data: { title: "Working Effectively with Legacy Code", publishedYear: 2004 },
		}),
		prisma.book.create({
			data: { title: "Refactoring to Patterns", publishedYear: 2004 },
		}),
	]);

	const [
		cleanCode,
		pragmaticProgrammer,
		refactoring,
		cleanArchitecture,
		designPatterns,
		tdd,
		effectiveJava,
		poeaa,
		legacyCode,
		refactoringToPatterns,
	] = books;

		await prisma.authorBook.createMany({
			data: [
				// Robert C. Martin
				{ id_author: robertMartin.id, id_book: cleanCode.id },
				{ id_author: robertMartin.id, id_book: cleanArchitecture.id },
				// Martin Fowler
				{ id_author: martinFowler.id, id_book: refactoring.id },
				{ id_author: martinFowler.id, id_book: poeaa.id },
				// Gang of Four
				{ id_author: erichGamma.id, id_book: designPatterns.id },
				{ id_author: richardHelm.id, id_book: designPatterns.id },
				{ id_author: ralphJohnson.id, id_book: designPatterns.id },
				{ id_author: johnVlissides.id, id_book: designPatterns.id },
				// Kent Beck
				{ id_author: kentBeck.id, id_book: tdd.id },
				{ id_author: kentBeck.id, id_book: legacyCode.id },
				// Joshua Bloch
				{ id_author: joshuaBloch.id, id_book: effectiveJava.id },
				// Multiple authors on same book
				{ id_author: martinFowler.id, id_book: legacyCode.id },
				{ id_author: kentBeck.id, id_book: refactoringToPatterns.id },
			],
		});

	console.log("Seed done!");
}

main()
	.catch((error) => {
		console.error("Error:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});