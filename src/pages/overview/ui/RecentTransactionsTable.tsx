import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { RecentTransactionRow } from "@/entities/transaction/ui/RecentTransactionRow";
import "./RecentTransactionsTable.css";

export const RecentTransactionsTable = () => {
  const { transactions, isLoading } = useTransactionsStore();

  if (isLoading) {
    return (
      <div className="recent-transactions-table__loading">
        Loading transactions...
      </div>
    ); // сюда можно потом вставить спиннер или скелетон
  }

  if (transactions.length === 0) {
    return <div>No transactions yet</div>;
  }

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="recent-transactions-table">
      <div className="recent-transactions-table__header">
        <span className="recent-transactions-table__cell-name">Date</span>
        <span className="recent-transactions-table__cell-name">
          Description
        </span>
        <span className="recent-transactions-table__cell-name">Category</span>
        <span className="recent-transactions-table__cell-name">Amount</span>
      </div>

      {recent.map((t) => (
        <RecentTransactionRow
          key={t.id}
          date={t.date}
          description={t.description}
          categoryId={t.categoryId}
          type={t.type}
          amount={t.amount}
        />
      ))}
    </div>
  );
};
