import { IoChevronDownOutline } from "react-icons/io5";
import type { CatalogFilterOption } from "@/interfaces/catalog";

interface FilterGroupProps {
  title: string;
  options: CatalogFilterOption[];
  selectedIds?: string[];
  onToggle?: (id: string) => void;
}

export function FilterGroup({
  title,
  options,
  selectedIds = [],
  onToggle,
}: FilterGroupProps) {
  const checked = (id: string) => selectedIds.includes(id);
  const filterOptions = options.filter(({ count }) => !!count);

  return (
    <div className="filter-group">
      <button type="button" className="filter-group-head">
        {title}
        <IoChevronDownOutline aria-hidden="true" />
      </button>
      <div className="filter-group-body">
        {filterOptions.map((option) => (
          <label key={option.id} className="filter-check" htmlFor={option.id}>
            <input
              type="checkbox"
              id={option.id}
              checked={checked(option.id)}
              onChange={() => onToggle?.(option.id)}
            />
            {option.label}
            <span className="fc-count">{option.count}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
