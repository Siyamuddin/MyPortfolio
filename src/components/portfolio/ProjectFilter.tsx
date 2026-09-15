"use client";

const options = [
  "All",
  "Web Development",
  "Applications",
  "Automation",
] as const;
export type ProjectFilterValue = (typeof options)[number];
export const ProjectFilter = ({
  value,
  onChange,
}: {
  value: ProjectFilterValue;
  onChange: (value: ProjectFilterValue) => void;
}) => (
  <div className="project-filter" role="group" aria-label="Filter projects">
    {options.map((option) => (
      <button
        type="button"
        key={option}
        aria-pressed={value === option}
        onClick={() => onChange(option)}
      >
        {option}
      </button>
    ))}
  </div>
);
