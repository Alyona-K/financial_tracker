import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "db.json");
const outputPath = path.join(__dirname, "db.normalized.json");

// читаем db.json
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// строим маппинг: name -> id и добавляем isDeleted: false для всех категорий
const normalizedCategories = db.categories.map(c => ({
  ...c,
  isDeleted: false
}));

const categoryMap = Object.fromEntries(
  normalizedCategories.map(c => [c.name.toLowerCase(), c.id])
);

// пробегаем все транзакции и нормализуем categoryId
const normalizedTransactions = db.transactions.map(tx => ({
  ...tx,
  categoryId: categoryMap[tx.categoryId.toLowerCase()] || tx.categoryId
}));

const normalizedDb = {
  ...db,
  categories: normalizedCategories,
  transactions: normalizedTransactions
};

fs.writeFileSync(outputPath, JSON.stringify(normalizedDb, null, 2));

console.log(`Готово! Сохранено в ${outputPath}`);

