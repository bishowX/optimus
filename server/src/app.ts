import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { contentRoutes } from "./routes/content";


const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/contents", contentRoutes)

app.get("*", serveStatic({ root: "../frontend/dist" }));

export default app;
export type ApiRoutes = typeof apiRoutes