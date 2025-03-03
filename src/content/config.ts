import { defineCollection, reference, z } from "astro:content";

// documentație: https://zod.dev/

const resourceCollection = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		url: z.string().url({ message: "URL invalid" }),
		language: z.enum(["en", "ro"]),
		modDate: z.string().optional(),
		addDate: z.string(),
		description: z.string(),
		authorName: z.string().optional(),
		authorUrl: z.string().url({ message: "URL invalid" }).optional(),
		section: reference('sections'),
		categories: z.array(reference('categories')).nullish(),
		subcategories: z.array(reference('subcategories')).nullish(),
		rating: z.number().min(1, "Rating-ul nu poate avea mai puțin de nota 1").max(100, "Rating-ul nu poate avea mai mult de nota 10").optional(),
		price: z.number().min(0, "Prețul nu poate fi negativ").optional(),
		requiredTime: z.number().optional(),
		type: z.enum(["text", "video", "curs", "carte"]),
		mandatory: z.boolean(),
		image: z.object({
			// @TODO: make either imageLocalUrl or imageUrl be validated for the image object to become valid
			imageLocalUrl: image().refine((img) => img.width >= 1000, {
				message: "Imaginea trebuie să aibă minim 1000px lățime!",
			}).optional(),
			// @TODO: add file type extension validation for imageUrl
			imageUrl: z.string().url("Imagine cu URL invalid.").optional(),
			imageAlt: z.string().optional(),
		}).nullish(),
		tags: z.array(reference('tags')),
	})
});

const tagCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		type: z.string(),
		image: z.object({
			imageUrl: z.string().url({ message: "URL invalid" }),
			imageAlt: z.string().optional(),
		}).nullish(),
		description: z.string().max(165, { message: "Descrierea scurtă trebuie să fie de maxim 165 caractere" }),
		publishDate: z.date().optional(),
	}),
});

const sectionCollection = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		menu: z.string(),
		sortOrder: z.number(),
		imageUrl: image().refine((img) => img.width >= 100, {
			message: "Imaginea trebuie să aibă minim 100px lățime!",
		}).optional(),
		imageAlt: z.string().optional(),
		description: z.string().max(165, { message: "Descrierea scurtă trebuie să fie de maxim 165 caractere" }),
		categories: z.array(reference('categories')).nullish(),
		publishDate: z.date(),
	}),
});

const categoryCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		menu: z.string(),
		sortOrder: z.number(),
		image: z.object({
			imageUrl: z.string().optional(),
			imageAlt: z.string().optional(),
		}).nullish(),
		description: z.string().max(165, { message: "Descrierea scurtă trebuie să fie de maxim 165 caractere" }),
		subcategories: z.array(reference('subcategories')).nullish(),
		publishDate: z.date(),
	}),
});

const subcategoriesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		menu: z.string(),
		sortOrder: z.number(),
		image: z.object({
			imageUrl: z.string().optional(),
			imageAlt: z.string().optional(),
		}).nullish(),
		description: z.string().max(165, { message: "Descrierea scurtă trebuie să fie de maxim 165 caractere" }),
	}),
});

export const collections = {
	'resources': resourceCollection,
	'tags': tagCollection,
	'sections': sectionCollection,
	'categories': categoryCollection,
	'subcategories': subcategoriesCollection,
};