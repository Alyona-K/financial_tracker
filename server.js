import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors";
import fs from "fs";
import path from "path";

// --- READ ROUTES ---
const rules = JSON.parse(
  fs.readFileSync(path.resolve('./routes.json'), 'utf-8')
);

const server = jsonServer.create();
const router = jsonServer.router("db.normalized.json");
const middlewares = jsonServer.defaults();

// --- ENABLE CORS AND DEFAULT MIDDLEWARES ---
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://financialtracker-ak.vercel.app",
    ],
    credentials: true,
  })
);
server.use(middlewares);

// --- SANITIZE INPUT DATA ---
function sanitizeString(str) {
  return str.replace(/[<>"'/`;&]/g, "").trim();
}

function sanitizeObject(obj) {
  const sanitized = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    sanitized[key] =
      typeof value === "string" ? sanitizeString(value) : value;
  });
  return sanitized;
}

// --- SANITIZE INPUT ONLY FOR NON-AUTH RESOURCES ---
server.use((req, _res, next) => {
  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    !req.path.startsWith("/login") &&
    !req.path.startsWith("/register")
  ) {
    req.body = sanitizeObject(req.body);
  }
  next();
});

// --- CUSTOM SOFT DELETE FOR CATEGORIES ---
server.delete("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const categoriesDb = router.db.get("categories");
  const category = categoriesDb.find({ id: categoryId }).value();

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  categoriesDb
    .find({ id: categoryId })
    .assign({ isDeleted: true })
    .write();

  console.log(`Category ${categoryId} soft-deleted, transactions preserved`);

  res.status(200).json({ message: "Category soft-deleted, transactions preserved" });
});

// --- CUSTOM GET CATEGORIES FILTERED (EXCLUDE DELETED) ---
server.get("/categories", (_req, res) => {
  const categories = router.db.get("categories").value();
  res.json(categories.filter(c => !c.isDeleted));
});

// --- ATTACH JSON-SERVER-AUTH ---
server.db = router.db;
server.use(auth.rewriter(rules));
server.use(auth);
server.use(router);

// --- START SERVER ---
server.listen(3001, () => {
  console.log("Auth server running on http://localhost:3001");
});
