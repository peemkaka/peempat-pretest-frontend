import { useState } from "react";
import { IoFunnelOutline } from "react-icons/io5";
const FILTER_STORAGE_KEY = "quotes_filter_setting";

interface FilterDropdownProps {
  onFilter: (filter: string) => void;
}

const FilterDropdown = ({ onFilter }: FilterDropdownProps) => {
  const [selectedFilter, setSelectedFilter] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(FILTER_STORAGE_KEY) || "newest";
    }
    return "newest";
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFilter(value);
    onFilter(value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <IoFunnelOutline className="h-5 w-5 text-gray-400" />
      </div>
      <select
        value={selectedFilter}
        onChange={handleChange}
        className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="top">Top Voted</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default FilterDropdown;
