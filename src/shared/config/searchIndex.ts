export interface SearchItem {
  label: string;
  path: string;
  section?: string;
}

export const globalSearchIndex: SearchItem[] = [
  // --- TRANSACTIONS ---
  { label: "Transactions page", path: "/transactions" },
  {
    label: "Transactions table",
    path: "/transactions",
    section: "transactions-table",
  },

  // --- CATEGORIES ---
  { label: "Categories page", path: "/categories" },
  {
    label: "Categories table",
    path: "/categories",
    section: "categories-table",
  },

  // --- OVERVIEW ---
  { label: "Overview page", path: "/overview" },
  { label: "Widgets section", path: "/overview", section: "widgets" },
  { label: "Analytics section", path: "/overview", section: "analytics" },
  {
    label: "Recent transactions section",
    path: "/overview",
    section: "recent-transactions",
  },

  // --- PROFILE ---
  { label: "Profile page", path: "/profile" },

  // --- HOME ---
  { label: "Home page", path: "/" },
];
