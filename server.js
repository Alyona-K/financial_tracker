import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors";
import fs from "fs";
import path from "path";

const rules = JSON.parse(
  fs.readFileSync(path.resolve('./routes.json'), 'utf-8')
);

const server = jsonServer.create();
const router = jsonServer.router("db.normalized.json");
const middlewares = jsonServer.defaults();

// --- подключаем CORS и стандартные middlewares ---
server.use(cors());
server.use(middlewares);

// --- кастомный soft DELETE для категорий ---
server.delete("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const categoriesDb = router.db.get("categories");
  const category = categoriesDb.find({ id: categoryId }).value();

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Делаем soft delete: флаг isDeleted
  categoriesDb
    .find({ id: categoryId })
    .assign({ isDeleted: true })
    .write();

  console.log(`Category ${categoryId} soft-deleted, transactions preserved`);

  res.status(200).json({ message: "Category soft-deleted, transactions preserved" });
});

// --- кастомный GET категорий с фильтром для фронта (по желанию) ---
server.get("/categories", (req, res) => {
  const categories = router.db.get("categories").value();
  res.json(categories.filter(c => !c.isDeleted)); // если хочешь, чтобы фронт по умолчанию не видел deleted
});

// --- подключаем json-server-auth ---
server.db = router.db;
server.use(auth.rewriter(rules));
server.use(auth);
server.use(router);

server.listen(3001, () => {
  console.log("Auth server running on http://localhost:3001");
});


