import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    joinedYear: z.number(),
    order: z.number(),
  }),
});

const clients = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/clients" }),
  schema: z.object({
    name: z.string(),
    logo: z.string().optional(),
    description: z.string(),
    url: z.string(),
    order: z.number(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    forWhom: z.string(),
    problem: z.string(),
    includes: z.array(z.string()),
    improves: z.string(),
    order: z.number(),
  }),
});

const process = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/process" }),
  schema: z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
  }),
});

const whyUs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/why-us" }),
  schema: z.object({
    title: z.string(),
    highlight: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number(),
  }),
});

export const collections = { team, clients, services, process, whyUs, faq };