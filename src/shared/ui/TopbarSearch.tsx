import React, { useState } from "react";
import Input from "@/shared/ui/Input";
import "./TopbarSearch.css";

const TopbarSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="topbar__search">
      <div className="input-wrapper">
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon="search-icon"
        />
      </div>
    </div>
  );
};

export default TopbarSearch;
