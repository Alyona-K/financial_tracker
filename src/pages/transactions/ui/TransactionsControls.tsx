import React, { useState } from "react";
import Button from "@/shared/ui/Button";
import TransactionsSearch from "./TransactionsSearch";
import RangeDatePicker from "@/shared/ui/RangeDatePicker";
import "./TransactionsControls.css";

type TransactionsControlsProps = {
  onSearchChange: (query: string) => void;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  onAddClick: () => void;
};

const TransactionsControls: React.FC<TransactionsControlsProps> = ({
  onSearchChange,
  onDateRangeChange,
  onAddClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    onSearchChange(val);
  };

  const handleRangeChange = (range: {
    start: Date | null;
    end: Date | null;
  }) => {
    onDateRangeChange(range.start, range.end);
  };

  return (
    <div className="transactions-controls">
      <div className="transactions-controls__search">
        <TransactionsSearch value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="transactions-controls__dates">
        <RangeDatePicker onChange={handleRangeChange} />
      </div>
      <div className="transactions-controls__add">
        <Button
          className="transactions-controls__btn btn btn--large"
          onClick={onAddClick}
        >
          Add transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionsControls;
