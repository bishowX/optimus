import { Hono } from "hono";

export const contentRoutes = new Hono().get("/", c => c.json({content: "Yay!!!"}))