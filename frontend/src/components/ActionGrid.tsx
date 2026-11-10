import { Link } from "react-router-dom";

export type Action = { label: string; path: string };

export default function ActionGrid({ actions, className = "" }: { actions: Action[]; className?: string }) {
  return (
    <div className={`action-grid ${className}`}>
      {actions.map((action) => (
        <Link key={action.path} to={action.path} className="action-link">
          {action.label}
        </Link>
      ))}
    </div>
  );
}
