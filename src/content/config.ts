import { z, reference, defineCollection } from "astro:content";

// documentație: https://zod.dev/

const resourceCollection = defineCollection({
	type: 'data',
	schema: ({ image }) => z.array(
		z.object({
			title: z.string(),
			slug: z.string(),
			url: z.string().url({ message: "URL invalid" }),
			language: z.enum(["en", "ro"]),
			pubDate: z.string().optional(),
			addDate: z.string(),
			description: z.string(),
			authorName: z.string().optional(),
			authorUrl: z.string().url({ message: "URL invalid" }).optional(),
			section: z.enum(["Front End", "Back End", "Design", "Marketing", "NetSec", "Altele"]),
			categories: z.array(reference('categories')),
			subcategories: z.array(reference('subcategories')).nullish(),
			rating: z.number().min(1, "Rating-ul nu poate avea mai puțin de nota 1").max(100, "Rating-ul nu poate avea mai mult de nota 10").optional(),
			price: z.number().min(0, "Prețul nu poate fi negativ").optional(),
			requiredTime: z.number().optional(),
			type: z.string(),
			mandatory: z.boolean(),
			image: z.object({
				imageLocalUrl: image().refine((img) => img.width >= 1200, {
					message: "Imaginea trebuie să aibă minim 1200px lățime!",
				}).optional(),
				imageUrl: z.string().url("Imagine cu URL invalid.").optional(),
				imageAlt: z.string().optional(),
			}).nullable().optional(),
			tags: z.array(reference('tags')),
		})
	)
});

const tagCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		image: z.object({
		  imageUrl: z.string().url({ message: "URL invalid" }),
		  imageAlt: z.string().optional(),
		}).nullable().optional(),
		shortDescription: z.string().max(165, { message: "Descrierea scurtă trebuie să fie de maxim 165 caractere" }),
		publishDate: z.date().optional(),
	}),
})

const sectionCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		menu: z.string(),
		sortOrder: z.number(),
		image: z.object({
		  imageUrl: z.string().optional(),
		  imageAlt: z.string().optional(),
		}).nullable().optional(),
		shortDescription: z.string().max(165, { message: "Descrierea scurtă trebuie să fie de maxim 165 caractere" }),
		categories: z.array(reference('categories')),
		publishDate: z.date(),
	}),
})

const categoryCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		sortOrder: z.number(),
		image: z.object({
		  imageUrl: z.string().optional(),
		  imageAlt: z.string().optional(),
		}).nullable().optional(),
		shortDescription: z.string().max(165, { message: "Descrierea scurtă trebuie să fie de maxim 165 caractere" }),
		subcategories: z.array(reference('subcategories')).nullable().optional(),
		publishDate: z.date(),
	}),
})

const subcategoriesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		sortOrder: z.number(),
	}),
})

export const collections = {
	'resources': resourceCollection,
	'tags': tagCollection,
	'sections': sectionCollection,
	'categories': categoryCollection,
	'subcategories': subcategoriesCollection,
}