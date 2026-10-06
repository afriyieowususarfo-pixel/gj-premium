import { Link } from "react-router";

export type Crumb = { label: string; to?: string };

/** Hairline breadcrumb trail: Home → … → current page. */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
        <li className="flex items-center gap-2.5">
          <Link
            to="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <span aria-hidden>/</span>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.label}
              className="flex items-center gap-2.5"
              aria-current={isLast ? "page" : undefined}
            >
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
