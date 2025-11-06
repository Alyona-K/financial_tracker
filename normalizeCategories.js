import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "db.json");
const outputPath = path.join(__dirname, "db.normalized.json");

// READ ORIGINAL DB JSON
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// ADD isDeleted FLAG TO CATEGORIES
const normalizedCategories = db.categories.map((c) => ({
  ...c,
  isDeleted: false,
}));

// BUILD MAP FROM CATEGORY NAME TO ID
const categoryMap = Object.fromEntries(
  normalizedCategories.map((c) => [c.name.toLowerCase(), c.id])
);

// NORMALIZE TRANSACTIONS WITH CATEGORY MAPPING
const normalizedTransactions = db.transactions.map((tx) => ({
  ...tx,
  categoryId: categoryMap[tx.categoryId.toLowerCase()] || tx.categoryId,
}));

// COMBINE NORMALIZED DATA
const normalizedDb = {
  ...db,
  categories: normalizedCategories,
  transactions: normalizedTransactions,
};

fs.writeFileSync(outputPath, JSON.stringify(normalizedDb, null, 2));

console.log(`Saved normalized DB to ${outputPath}`);
