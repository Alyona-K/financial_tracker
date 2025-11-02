import React from "react";
import Input from "@/shared/ui/Input";
import "./TransactionsSearch.scss";

type TransactionsSearchProps = {
  value: string;
  onChange: (val: string) => void;
};

const TransactionsSearch: React.FC<TransactionsSearchProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="transactions-search">
      <Input
        placeholder="Search for anything..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon="search-icon"
        wrapperClassName="transactions-search__wrapper"
        fieldClassName="transactions-search__field"
        iconClassName="transactions-search__icon"
      />
    </div>
  );
};

export default TransactionsSearch;
