import React, { useState } from "react";
import Input from "@/shared/ui/Input";
import "./TopbarSearch.scss";

const TopbarSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="topbar__search">
      <div className="topbar__input-wrapper">
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon="search-icon"
          iconClassName="topbar__search-icon"
        />
      </div>
    </div>
  );
};

export default TopbarSearch;
