import { useState, useEffect } from "react";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Dropdown from "@/shared/ui/Dropdown";
import { parseDate } from "@/shared/lib/parseDate";
import "./AnalyticsSection.css";

const AnalyticsSection = () => {
  const { transactions, fetchTransactions } = useTransactionsStore();
  const [loaded, setLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions().then(() => {
      setLoaded(true);
    });
  }, [fetchTransactions]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (!transactions.length) {
      return;
    }

    const filtered = transactions.filter((tx) => {
      const date = parseDate(tx.date);
      return date && date.getFullYear().toString() === selectedYear;
    });

    const months = Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;
      const incomeSum = filtered
        .filter(
          (tx) =>
            tx.type === "Income" &&
            parseDate(tx.date)?.getMonth() + 1 === monthNumber
        )
        .reduce((acc, t) => acc + Number(t.amount), 0);

      const expensesSum = filtered
        .filter(
          (tx) =>
            tx.type === "Expenses" &&
            parseDate(tx.date)?.getMonth() + 1 === monthNumber
        )
        .reduce((acc, t) => acc + Number(t.amount), 0);

      const monthData = {
        month: new Date(0, i).toLocaleString("en", { month: "short" }),
        Income: incomeSum,
        Expenses: expensesSum,
      };
      return monthData;
    });

    setChartData(months);
  }, [transactions, selectedYear, loaded]);

  return (
    <div className="analytics">
      <div className="analytics__header-wrap">
        <h3 className="analytics__header">Analytics</h3>
        <Dropdown
          value={selectedYear}
          options={["2025", "2024"]}
          onChange={setSelectedYear}
          isOpen={dropdownOpen}
          onToggle={() => setDropdownOpen((prev) => !prev)}
          onClose={() => setDropdownOpen(false)}
          showAllOption={false}
          wrapperClassName="analytics__dropdown-wrapper"
          buttonClassName="analytics__dropdown-btn"
          listClassName="analytics__dropdown-list"
          itemClassName="analytics__dropdown-item"
          iconClassName="analytics__dropdown-icon"
        />
      </div>

      <div className="analytics__chart">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip formatter={(val: number) => `$${val}`} />
            <Legend />
            <Bar dataKey="Income" fill="#6b3af1ff" />
            <Bar dataKey="Expenses" fill="#5AC8FA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsSection;

//   return (
//     <div className="analytics">
//       <div className="analytics__header">
//         <h3>Transactions Analytics ({selectedYear})</h3>
//         <Dropdown
//           value={selectedYear}
//           options={["2025", "2024"]}
//           onChange={setSelectedYear}
//           isOpen={dropdownOpen}
//           onToggle={() => setDropdownOpen(prev => !prev)}
//           onClose={() => setDropdownOpen(false)}
//           showAllOption={false}
//           wrapperClassName="analytics__dropdown-wrapper"
//           buttonClassName="analytics__dropdown-btn"
//           listClassName="analytics__dropdown-list"
//           itemClassName="analytics__dropdown-item"
//         />
//       </div>

//       <div className="analytics__chart">
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
//             <Tooltip formatter={(val: number) => `$${val}`} />
//             <Legend />
//             <Bar dataKey="Income" fill="#7B61FF" />
//             <Bar dataKey="Expenses" fill="#5AC8FA" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };
