import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/shared/ui/Input";
import Dropdown from "@/shared/ui/Dropdown";
import { globalSearchIndex, SearchItem } from "@/shared/config/searchIndex";
import "./TopbarSearch.scss";

const TopbarSearch: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    setFiltered(
      globalSearchIndex.filter((item) =>
        item.label.toLowerCase().includes(lowerQuery)
      )
    );
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setQuery(item.label);
    setIsOpen(false);

    navigate(item.path, {
      state: { scrollTo: item.section || null },
    });
  };

  return (
    <div className="topbar__search" ref={wrapperRef}>
      <div className="topbar__input-wrapper">
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon="search-icon"
          iconClassName="topbar__search-icon"
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <Dropdown
          options={filtered.map((f) => f.label)}
          value={query}
          onChange={(label) => {
            const item = filtered.find((f) => f.label === label);
            if (!item) return;
            handleSelect(item);
          }}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
          onClose={() => setIsOpen(false)}
          placeholder="Search"
          wrapperClassName="topbar__search-dropdown-wrapper"
          buttonClassName="topbar__search-btn"
          listClassName="topbar__search-list"
          itemClassName="topbar__search-item"
          showAllOption={false}
        />
      )}
    </div>
  );
};

export default TopbarSearch;

