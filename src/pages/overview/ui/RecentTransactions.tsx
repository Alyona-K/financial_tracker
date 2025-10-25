import Button from "@/shared/ui/Button";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import "./RecentTransactions.css";

type RecentTransactionsProps = {
  onAddClick: () => void;
};

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  onAddClick,
}) => {
  return (
    <div className="recent-transactions">
      <div className="recent-transactions__content-top">
        <h3 className="recent-transactions__title">Recent Transactions</h3>
        <Button
          className="recent-transactions__btn btn btn--large"
          onClick={onAddClick}
        >
          Add transaction
        </Button>
      </div>
      <RecentTransactionsTable />
    </div>
  );
};

export default RecentTransactions;
