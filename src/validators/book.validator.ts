// Book validators
import { z } from 'zod';

// Current year used for publishedYear checks
const currentYear: number = new Date().getFullYear();

// URL validator
export const urlSchema = z.string().refine((value: string) => {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}, {
    message: 'Must be a valid http or https URL',
});

// Schemas
export const createBookSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title can be maximum 255 characters'),
    isbn: z.string().regex(/^\d{10}(\d{3})?$/, 'ISBN must be 10 or 13 digits'),
    publishedYear: z.number().int('Published year must be an integer').min(0, 'Published Year must be positive').max(currentYear, `Published year cannot be greater than ${currentYear}`),
    pageCount: z.number().int('Page count must be an integer').min(1, 'Page count must be at least 1'),
    language: z.string().min(1, 'Language is required').max(100, 'Language can be maximum 100 characters'),
    description: z.string().max(2000, 'Description can be maximum 2000 characters').optional(),
    coverImage: urlSchema.optional(),
    authorId: z.number().int('Author ID must be an integer').min(1, "Author ID must be at least 1"),
    publisherId: z.number().int('Publisher ID must be an integer').min(1, 'Publisher ID must be at least 1'),
    genres: z.array(z.string().min(1, 'Genre cannot be empty')).min(1, 'At least one genre is required'),
});

export const updateBookSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title can be maximum 255 characters').optional(),
    isbn: z.string().regex(/^\d{10}(\d{3})?$/, 'ISBN must be 10 or 13 digits').optional(),
    publishedYear: z.number().int('Published year must be an integer').min(0, 'Published Year must be positive').max(currentYear, `Published year cannot be greater than ${currentYear}`).optional(),
    pageCount: z.number().int('Page count must be an integer').min(1, 'Page count must be at least 1').optional(),
    language: z.string().min(1, 'Language cannot be empty').max(100, 'Language can be maximum 100 characters').optional(),
    description: z.string().max(2000, 'Description can be maximum 2000 characters').optional(),
    coverImage: urlSchema.optional(),
    authorId: z.number().int('Author ID must be an integer').min(1, 'Author ID must be at least 1').optional(),
    publisherId: z.number().int('Publisher ID must be an integer').min(1, 'Publisher ID must be at least 1').optional(),
    genres: z.array(z.string().min(1, 'Genre cannot be empty')).min(1, 'At least one genre is required').optional(),
});

export const bookQuerySchema = z.object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    author: z.string().min(1, 'Author cannot be empty').optional(),
    genre: z.string().min(1, 'Genre cannot be empty').optional(),
    language: z.string().min(1, 'Language cannot be empty').optional(),
    year: z.coerce.number().int('Year must be an integer').min(0, 'Year must be positive').max(currentYear, `Year cannot be greater than ${currentYear}`).optional(),
    sortBy: z.enum(["title", "publishedYear"]).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int('Page must be an integer').min(1, 'Page must be at least 1').optional(),
    limit: z.coerce.number().int('Limit must be an integer').min(1, 'Limit must be at least 1').max(100, 'Limit cannot be greater than 100').optional(),
});