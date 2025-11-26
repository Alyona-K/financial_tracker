import jsonServer from "json-server";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- CONSTANTS ---
const JWT_SECRET = "super-secret-key";
const JWT_REFRESH_SECRET = "super-refresh-secret-key";
const DEMO_ID = 1;
const DEMO_EMAIL = "demo@fintrack.com";
const DEMO_PASSWORD = "demo123";

// --- SERVER INIT ---
const server = jsonServer.create();
const router = jsonServer.router("db.normalized.json");
const middlewares = jsonServer.defaults();

// --- MIDDLEWARES ---
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://financialtracker-ak.vercel.app",
    ],
    credentials: true,
  })
);

server.use(jsonServer.bodyParser);
server.use(middlewares);

// --- AUTH MIDDLEWARE ---
function authGuard(req, res, next) {
  if (
    req.path === "/login" ||
    req.path === "/register" ||
    req.path.startsWith("/public")
  ) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Missing token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

server.use(authGuard);

// --- DATABASE HELPERS ---
const usersDb = router.db.get("users");

// --- DEMO USER ENSURE ---
let demoUser = usersDb.find({ id: DEMO_ID }).value();

if (!demoUser) {
  const hashed = bcrypt.hashSync(DEMO_PASSWORD, 10);
  usersDb
    .push({
      id: DEMO_ID,
      email: DEMO_EMAIL,
      password: hashed,
      firstName: "Julia",
      lastName: "Bennett",
      avatar: "/images/avatar.png",
      location: "Canada",
    })
    .write();
}


// --- REGISTER ---
server.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName)
    return res.status(400).json({ message: "Missing required fields" });

  const existing = usersDb.find({ email }).value();
  if (existing) return res.status(409).json({ message: "Email already taken" });

  const maxId = Math.max(...usersDb.map(u => u.id), DEMO_ID);
  const newId = maxId + 1;

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: newId,
    email,
    password: hashed,
    firstName,
    lastName,
    avatar: "",
    location: "",
    refreshToken: null,
  };

  usersDb.push(newUser).write();

  const accessToken = jwt.sign(
    { id: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: newUser.id },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  usersDb.find({ id: newUser.id }).assign({ refreshToken }).write();

  res.status(201).json({ user: newUser, accessToken, refreshToken });
});


// --- LOGIN ---
server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = usersDb.find({ email }).value();
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  usersDb.find({ id: user.id }).assign({ refreshToken }).write();

  res.json({ user, accessToken, refreshToken });
});

// --- REFRESH ---
server.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Missing token" });

  const user = usersDb.find({ refreshToken }).value();
  if (!user) return res.status(403).json({ message: "Invalid refresh token" });

  try {
    jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    usersDb.find({ id: user.id }).assign({ refreshToken: newRefreshToken }).write();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

// --- CUSTOM CATEGORY DELETE (soft delete) ---
server.delete("/categories/:id", (req, res) => {
  const categoryId = Number(req.params.id);
  const categoriesDb = router.db.get("categories");

  const category = categoriesDb.find({ id: categoryId }).value();
  if (!category)
    return res.status(404).json({ message: "Category not found" });

  categoriesDb.find({ id: categoryId }).assign({ isDeleted: true }).write();

  res.json({ message: "Category soft-deleted" });
});

// --- CUSTOM GET CATEGORIES (exclude deleted) ---
server.get("/categories", (_req, res) => {
  const categories = router.db.get("categories").value();
  res.json(categories.filter((c) => !c.isDeleted));
});


// --- ROUTER ---
server.use(router);


// --- START SERVER ---
server.listen(3001, () => {
  console.log("Custom JWT server running on http://localhost:3001");
});
