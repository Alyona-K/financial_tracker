// import { categories } from "@/data/mock/categories";
// import { CategoryType } from "@/data/mock/categories";

// export type Transaction = {
//   id: string;
//   date: string;
//   description: string;
//   category: string; // совпадает с name из categories
//   type: CategoryType;
//   amount: number;
// };

// export const transactions: Transaction[] = [
//   {
//     id: "1",
//     date: "2025-09-06",
//     description: "Adobe After Effects",
//     category: "Software",
//     type: categories.find((c) => c.name === "Software")?.type ?? "Expenses",
//     amount: 20.99,
//   },
//   {
//     id: "2",
//     date: "2025-09-06",
//     description: "Starbucks Coffee",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 4.5,
//   },
//   {
//     id: "3",
//     date: "2025-09-06",
//     description: "Uber ride",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 12.99,
//   },
//   {
//     id: "4",
//     date: "2025-09-05",
//     description: "September Salary",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 1500,
//   },
//   {
//     id: "5",
//     date: "2025-09-05",
//     description: "Netflix",
//     category: "Subscriptions",
//     type:
//       categories.find((c) => c.name === "Subscriptions")?.type ?? "Expenses",
//     amount: 9.99,
//   },
//   {
//     id: "6",
//     date: "2025-09-05",
//     description: "New Sneakers",
//     category: "Shopping/Clothing",
//     type:
//       categories.find((c) => c.name === "Shopping/Clothing")?.type ??
//       "Expenses",
//     amount: 75,
//   },
//   {
//     id: "7",
//     date: "2025-09-05",
//     description: "Supermarket",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 32,
//   },
//   {
//     id: "8",
//     date: "2025-09-04",
//     description: "Gym Membership",
//     category: "Health/Fitness",
//     type:
//       categories.find((c) => c.name === "Health/Fitness")?.type ?? "Expenses",
//     amount: 40,
//   },
//   {
//     id: "9",
//     date: "2025-09-04",
//     description: "Gasoline",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 45,
//   },
//   {
//     id: "10",
//     date: "2025-09-04",
//     description: "Stocks Purchase",
//     category: "Investments",
//     type: categories.find((c) => c.name === "Investments")?.type ?? "Income",
//     amount: 200,
//   },
//   {
//     id: "11",
//     date: "2025-09-03",
//     description: "React Online Course",
//     category: "Education/Courses",
//     type:
//       categories.find((c) => c.name === "Education/Courses")?.type ??
//       "Expenses",
//     amount: 30,
//   },
//   {
//     id: "12",
//     date: "2025-09-01",
//     description: "Freelance Project",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 350,
//   },
//   {
//     id: "13",
//     date: "2025-08-30",
//     description: "Dividend Payment",
//     category: "Investments",
//     type: categories.find((c) => c.name === "Investments")?.type ?? "Income",
//     amount: 75,
//   },
//   {
//     id: "14",
//     date: "2025-08-29",
//     description: "Lunch at Cafe",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 15,
//   },
//   {
//     id: "15",
//     date: "2025-08-28",
//     description: "Train Ticket",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 50,
//   },
//   {
//     id: "16",
//     date: "2025-08-27",
//     description: "Website Design",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 500,
//   },
//   {
//     id: "17",
//     date: "2025-10-03",
//     description: "WordPress Course",
//     category: "Education/Courses",
//     type:
//       categories.find((c) => c.name === "Education/Courses")?.type ??
//       "Expenses",
//     amount: 60,
//   },
//   {
//     id: "18",
//     date: "2025-10-06",
//     description: "Mercadona",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 9.99,
//   },
//   {
//     id: "19",
//     date: "2025-10-06",
//     description: "Airplane Ticket",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 80,
//   },
//   {
//     id: "20",
//     date: "2025-08-01",
//     description: "Coffee at Starbucks",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 4.5,
//   },
//   {
//     id: "21",
//     date: "2025-08-02",
//     description: "Bus Ticket",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 2.5,
//   },
//   {
//     id: "22",
//     date: "2025-08-03",
//     description: "Groceries at Mercadona",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 35.0,
//   },
//   {
//     id: "23",
//     date: "2025-08-05",
//     description: "Gym Membership",
//     category: "Health/Fitness",
//     type:
//       categories.find((c) => c.name === "Health/Fitness")?.type ?? "Expenses",
//     amount: 40,
//   },
//   {
//     id: "24",
//     date: "2025-08-10",
//     description: "Freelance Project",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 200,
//   },
//   {
//     id: "25",
//     date: "2025-08-15",
//     description: "Lunch with friends",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 18,
//   },
//   {
//     id: "26",
//     date: "2025-08-20",
//     description: "Movie Night",
//     category: "Entertainment",
//     type:
//       categories.find((c) => c.name === "Entertainment")?.type ?? "Expenses",
//     amount: 12,
//   },
//   {
//     id: "27",
//     date: "2025-08-25",
//     description: "Monthly Subscription",
//     category: "Subscriptions",
//     type:
//       categories.find((c) => c.name === "Subscriptions")?.type ?? "Expenses",
//     amount: 10,
//   },
//   {
//     id: "28",
//     date: "2025-09-07",
//     description: "Taxi Ride",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 15,
//   },
//   {
//     id: "29",
//     date: "2025-09-10",
//     description: "Groceries",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 40,
//   },
//   {
//     id: "30",
//     date: "2025-09-12",
//     description: "Yoga Class",
//     category: "Health/Fitness",
//     type:
//       categories.find((c) => c.name === "Health/Fitness")?.type ?? "Expenses",
//     amount: 25,
//   },
//   {
//     id: "31",
//     date: "2025-10-01",
//     description: "Internet Bill",
//     category: "Subscriptions",
//     type:
//       categories.find((c) => c.name === "Subscriptions")?.type ?? "Expenses",
//     amount: 30,
//   },
//   {
//     id: "32",
//     date: "2025-10-02",
//     description: "Freelance Income",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 400,
//   },
//   {
//     id: "33",
//     date: "2025-10-05",
//     description: "Dinner Out",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 27,
//   },
//   {
//     id: "34",
//     date: "2025-10-07",
//     description: "Train Ticket",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 50,
//   },
//   {
//     id: "35",
//     date: "2025-09-15",
//     description: "Lunch at Cafe",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 20,
//   },
//   {
//     id: "36",
//     date: "2025-09-16",
//     description: "Movie Tickets",
//     category: "Entertainment",
//     type:
//       categories.find((c) => c.name === "Entertainment")?.type ?? "Expenses",
//     amount: 15,
//   },
//   {
//     id: "37",
//     date: "2025-09-17",
//     description: "Taxi Ride",
//     category: "Transport",
//     type: categories.find((c) => c.name === "Transport")?.type ?? "Expenses",
//     amount: 18,
//   },
//   {
//     id: "38",
//     date: "2025-09-18",
//     description: "Grocery Shopping",
//     category: "Food/Groceries",
//     type:
//       categories.find((c) => c.name === "Food/Groceries")?.type ?? "Expenses",
//     amount: 45,
//   },
//   {
//     id: "39",
//     date: "2025-09-20",
//     description: "Yoga Class",
//     category: "Health/Fitness",
//     type:
//       categories.find((c) => c.name === "Health/Fitness")?.type ?? "Expenses",
//     amount: 25,
//   },
//   {
//     id: "40",
//     date: "2025-09-22",
//     description: "Book Purchase",
//     category: "Education/Courses",
//     type:
//       categories.find((c) => c.name === "Education/Courses")?.type ??
//       "Expenses",
//     amount: 30,
//   },
//   {
//     id: "41",
//     date: "2025-09-25",
//     description: "Freelance Payment",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 300,
//   },
//     {
//     id: "42",
//     date: "2025-10-05",
//     description: "October Salary",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 1500,
//   },
//     {
//     id: "43",
//     date: "2025-08-05",
//     description: "August Salary",
//     category: "Salary",
//     type: categories.find((c) => c.name === "Salary")?.type ?? "Income",
//     amount: 1500,
//   },
// ];
