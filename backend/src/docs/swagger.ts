// Docs: swagger specification setup
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import path from "path";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book API",
      version: "1.0.0",
      description: "API for managing books and reviews",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    tags: [
      {
        name: "Books",
        description: "Books endpoints",
      },
      {
        name: "Reviews",
        description: "Reviews endpoints",
      },
      {
        name: "Reference",
        description: "Helper endpoints for filters",
      },
    ],
    components: {
      schemas: {
        Book: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Clean Code" },
            isbn: { type: "string", example: "9780132350884" },
            publishedYear: { type: "integer", example: 2008 },
            pageCount: { type: "integer", example: 464 },
            language: { type: "string", example: "English" },
            description: {
              type: "string",
              example: "A handbook of agile software craftsmanship",
            },
            coverImage: {
              type: "string",
              example: "https://example.com/clean-code.jpg",
            },
            authorId: { type: "integer", example: 1 },
            publisherId: { type: "integer", example: 1 },
            genres: {
              type: "array",
              items: { type: "string" },
              example: ["Programming", "Software Engineering"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-18T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-18T10:00:00.000Z",
            },
          },
        },

        Review: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            bookId: { type: "integer", example: 1 },
            userName: { type: "string", example: "alex123" },
            rating: { type: "integer", example: 5 },
            comment: { type: "string", example: "Excellent book" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-18T10:00:00.000Z",
            },
          },
        },

        CreateBookInput: {
          type: "object",
          required: [
            "title",
            "isbn",
            "publishedYear",
            "pageCount",
            "language",
            "authorId",
            "publisherId",
            "genres",
          ],
          properties: {
            title: { type: "string", example: "Clean Code" },
            isbn: { type: "string", example: "9780132350884" },
            publishedYear: { type: "integer", example: 2008 },
            pageCount: { type: "integer", example: 464 },
            language: { type: "string", example: "English" },
            description: {
              type: "string",
              example: "A handbook of agile software craftsmanship",
            },
            coverImage: {
              type: "string",
              example: "https://example.com/clean-code.jpg",
            },
            authorId: { type: "integer", example: 1 },
            publisherId: { type: "integer", example: 1 },
            genres: {
              type: "array",
              items: { type: "string" },
              example: ["Programming", "Software Engineering"],
            },
          },
        },

        UpdateBookInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "Updated Clean Code" },
            isbn: { type: "string", example: "9780132350884" },
            publishedYear: { type: "integer", example: 2008 },
            pageCount: { type: "integer", example: 500 },
            language: { type: "string", example: "English" },
            description: {
              type: "string",
              example: "Updated description",
            },
            coverImage: {
              type: "string",
              example: "https://example.com/updated-clean-code.jpg",
            },
            authorId: { type: "integer", example: 1 },
            publisherId: { type: "integer", example: 1 },
            genres: {
              type: "array",
              items: { type: "string" },
              example: ["Programming"],
            },
          },
        },

        CreateReviewInput: {
          type: "object",
          required: ["userName", "rating"],
          properties: {
            userName: { type: "string", example: "alex123" },
            rating: { type: "integer", example: 5 },
            comment: { type: "string", example: "Excellent book" },
          },
        },

        PaginationMeta: {
          type: "object",
          properties: {
            currentPage: { type: "integer", example: 1 },
            totalPages: { type: "integer", example: 3 },
            totalItems: { type: "integer", example: 15 },
            itemsPerPage: { type: "integer", example: 5 },
            hasNextPage: { type: "boolean", example: true },
            hasPreviousPage: { type: "boolean", example: false },
          },
        },

        BooksListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Book",
              },
            },
            pagination: {
              $ref: "#/components/schemas/PaginationMeta",
            },
          },
        },

        BookResponse: {
          type: "object",
          properties: {
            data: {
              $ref: "#/components/schemas/Book",
            },
          },
        },

        ReviewsResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Review",
              },
            },
          },
        },

        AverageRatingResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                bookId: { type: "integer", example: 1 },
                averageRating: { type: "number", nullable: true, example: 4.5 },
              },
            },
          },
        },

        LanguagesResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { type: "string" },
              example: ["English", "Estonian", "German"],
            },
          },
        },

        GenresResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { type: "string" },
              example: ["Programming", "Fantasy", "History"],
            },
          },
        },

        AuthorsResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  fullName: { type: "string", example: "Robert Martin" },
                },
              },
            },
          },
        },

        PublishersResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "O'Reilly Media" },
                },
              },
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validation failed" },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "isbn" },
                  message: {
                    type: "string",
                    example: "ISBN must be 10 or 13 digits",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(process.cwd(), "src/routes/*.ts"),
    path.join(process.cwd(), "dist/routes/*.js"),
  ],
};

// build spec
export const swaggerSpec = swaggerJsdoc(options);