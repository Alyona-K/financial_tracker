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
import "./AnalyticsSection.scss";

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

    const aggregatedByMonth = filtered.reduce<
      Record<number, { Income: number; Expenses: number }>
    >((acc, tx) => {
      const date = parseDate(tx.date);
      if (!date) return acc;
      const month = date.getMonth() + 1;

      if (!acc[month]) acc[month] = { Income: 0, Expenses: 0 };
      acc[month][tx.type] += Number(tx.amount);
      return acc;
    }, {});

    const months = Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;
      const data = aggregatedByMonth[monthNumber] || { Income: 0, Expenses: 0 };

      return {
        month: new Date(0, i).toLocaleString("en", { month: "short" }),
        ...data,
      };
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
