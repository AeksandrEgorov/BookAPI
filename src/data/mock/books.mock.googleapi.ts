import axios from "axios";
import { Book } from "../../models/book.model";
const API_URL = "https://www.googleapis.com/books/v1/volumes";
/**
* Extracts a 4-digit year from a date string.
*
* @param date Date string from Google Books API (for example \"2020-01-01\").
* @returns Parsed year or current year if parsing fails.
*/
function getYear(date?: string): number {
	const y = date ? Number(date.slice(0, 4)) : NaN;
	return Number.isNaN(y) ? new Date().getFullYear() : y;
}
/**
* Fetches books from Google Books API by categories.
*
* @param count Maximum number of books to fetch.
* @param categories List of subject categories used to build the query.
* @returns Promise that resolves to an array of `Book` objects.
*/
export async function generateBooksFromGoogle(
	count: number,
	categories: string[]
): Promise<Book[]> {
	const q =
		categories.length > 0
			? categories.map((c) => `subject:${c}`).join(" OR ")
			: "subject:programming";

	const { data } = await axios.get(API_URL, {
		params: { q, maxResults: count }
	});
	if (!data.items) return [];
	return data.items.slice(0, count).map((item: any, i: number) => {
		const info = item.volumeInfo ?? {};
		return {
			id: i + 1,
			title: info.title ?? "Unknown title",
			author: info.authors?.[0] ?? "Unknown author",
			publishedYear: getYear(info.publishedDate)
		} as Book;
	});
}
export let books = generateBooksFromGoogle(20, ["programming"]);