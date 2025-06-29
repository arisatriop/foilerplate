import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";

// Komponen untuk fetch & render SVG dengan support warna dinamis
const SvgIcon: React.FC<{
  url: string;
  className?: string;
  colorClass?: string;
}> = ({ url, className = "w-5 h-5", colorClass = "text-gray-500" }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (
          !res.ok ||
          !res.headers.get("content-type")?.includes("image/svg")
        ) {
          throw new Error("Not a valid SVG");
        }
        return res.text();
      })
      .then((data) => {
        const sanitized = data.replace(/fill="[^"]*"/g, 'fill="currentColor"');
        setSvg(sanitized);
      })
      .catch(() => {
        setHasError(true);
      });
  }, [url]);

  if (hasError) {
    return (
      <div className={`w-5 h-5 ${colorClass}`}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
    );
  }

  return svg ? (
    <div
      className={`${className} ${colorClass}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  ) : (
    <div className={`w-5 h-5 animate-pulse ${colorClass}`}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </div>
  );
};

type NavItem = {
  name: string;
  iconUrl?: string;
  path?: string;
  pro?: boolean;
  new?: boolean;
  children?: NavItem[];
};

type MenuGroup = {
  title: string;
  items: NavItem[];
};

const Menus: MenuGroup[] = [
  {
    title: "SUPER ADMIN",
    items: [
      {
        name: "Dashboard",
        iconUrl:
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXJlZnJlc2gtY3ctb2ZmLWljb24gbHVjaWRlLXJlZnJlc2gtY3ctb2ZmIj48cGF0aCBkPSJNMjEgOEwxOC43NCA1Ljc0QTkuNzUgOS43NSAwIDAgMCAxMiAzQzExIDMgMTAuMDMgMy4xNiA5LjEzIDMuNDciLz48cGF0aCBkPSJNOCAxNkgzdjUiLz48cGF0aCBkPSJNMyAxMkMzIDkuNTEgNCA3LjI2IDUuNjQgNS42NCIvPjxwYXRoIGQ9Im0zIDE2IDIuMjYgMi4yNkE5Ljc1IDkuNzUgMCAwIDAgMTIgMjFjMi40OSAwIDQuNzQtMSA2LjM2LTIuNjQiLz48cGF0aCBkPSJNMjEgMTJjMCAxLS4xNiAxLjk3LS40NyAyLjg3Ii8+PHBhdGggZD0iTTIxIDN2NWgtNSIvPjxwYXRoIGQ9Ik0yMiAyMiAyIDIiLz48L3N2Zz4=",
        path: "/",
      },
      {
        name: "Manage",
        iconUrl:
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXJlZnJlc2gtY3ctb2ZmLWljb24gbHVjaWRlLXJlZnJlc2gtY3ctb2ZmIj48cGF0aCBkPSJNMjEgOEwxOC43NCA1Ljc0QTkuNzUgOS43NSAwIDAgMCAxMiAzQzExIDMgMTAuMDMgMy4xNiA5LjEzIDMuNDciLz48cGF0aCBkPSJNOCAxNkgzdjUiLz48cGF0aCBkPSJNMyAxMkMzIDkuNTEgNCA3LjI2IDUuNjQgNS42NCIvPjxwYXRoIGQ9Im0zIDE2IDIuMjYgMi4yNkE5Ljc1IDkuNzUgMCAwIDAgMTIgMjFjMi40OSAwIDQuNzQtMSA2LjM2LTIuNjQiLz48cGF0aCBkPSJNMjEgMTJjMCAxLS4xNiAxLjk3LS40NyAyLjg3Ii8+PHBhdGggZD0iTTIxIDN2NWgtNSIvPjxwYXRoIGQ9Ik0yMiAyMiAyIDIiLz48L3N2Zz4=",
        children: [
          {
            name: "User",
            iconUrl:
              "https://cdn.jsdelivr.net/npm/react-icons/fa@latest/fa/FaUser.svg",
            path: "/manage/user",
          },
          {
            name: "Role",
            iconUrl:
              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXJlZnJlc2gtY3ctb2ZmLWljb24gbHVjaWRlLXJlZnJlc2gtY3ctb2ZmIj48cGF0aCBkPSJNMjEgOEwxOC43NCA1Ljc0QTkuNzUgOS43NSAwIDAgMCAxMiAzQzExIDMgMTAuMDMgMy4xNiA5LjEzIDMuNDciLz48cGF0aCBkPSJNOCAxNkgzdjUiLz48cGF0aCBkPSJNMyAxMkMzIDkuNTEgNCA3LjI2IDUuNjQgNS42NCIvPjxwYXRoIGQ9Im0zIDE2IDIuMjYgMi4yNkE5Ljc1IDkuNzUgMCAwIDAgMTIgMjFjMi40OSAwIDQuNzQtMSA2LjM2LTIuNjQiLz48cGF0aCBkPSJNMjEgMTJjMCAxLS4xNiAxLjk3LS40NyAyLjg3Ii8+PHBhdGggZD0iTTIxIDN2NWgtNSIvPjxwYXRoIGQ9Ik0yMiAyMiAyIDIiLz48L3N2Zz4=",
            path: "/manage/role",
          },
          {
            name: "Menu",
            iconUrl:
              "https://cdn.jsdelivr.net/npm/react-icons/fa@latest/fa/FaList.svg",
            path: "/manage/menu",
          },
        ],
      },
    ],
  },
  {
    title: "ADMIN",
    items: [
      {
        name: "Analytics",
        iconUrl:
          "https://cdn.jsdelivr.net/npm/react-icons/md@latest/md/MdPieChart.svg",
        path: "/admin/analytics",
      },
      {
        name: "Integrations",
        iconUrl:
          "https://cdn.jsdelivr.net/npm/react-icons/md@latest/md/MdCode.svg",
        children: [
          {
            name: "API",
            iconUrl:
              "https://cdn.jsdelivr.net/npm/react-icons/md@latest/md/MdApi.svg",
            path: "/admin/integrations/api",
            pro: true,
          },
          {
            name: "Webhooks",
            iconUrl:
              "https://cdn.jsdelivr.net/npm/react-icons/md@latest/md/MdWebhook.svg",
            path: "/admin/integrations/webhooks",
            new: true,
          },
        ],
      },
      {
        name: "Inventory",
        iconUrl:
          "https://cdn.jsdelivr.net/npm/react-icons/md@latest/md/MdInventory.svg",
        path: "/admin/inventory",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const isAnyChildActive = (children?: NavItem[]): boolean => {
    return !!children?.some(
      (c) => c.path === location.pathname || isAnyChildActive(c.children)
    );
  };

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderRecursive = (items: NavItem[], level = 0) => (
    <ul className={level === 0 ? "space-y-2" : "ml-4 mt-2 space-y-1"}>
      {items.map((item) => {
        const hasChildren = item.children?.length;
        const isOpen = openMenus[item.name];
        const active = item.path
          ? isActive(item.path)
          : isAnyChildActive(item.children);

        return (
          <li key={item.name}>
            {hasChildren ? (
              <button
                onClick={() => toggleMenu(item.name)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left transition-colors
                  ${
                    active
                      ? "dark:bg-[#1F254A] bg-gray-100 text-indigo-500"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                  }
                  ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
              >
                {item.iconUrl && (
                  <SvgIcon
                    url={item.iconUrl}
                    colorClass={active ? "text-indigo-500" : "text-gray-500"}
                  />
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="text-sm font-medium">{item.name}</span>
                    <svg
                      className={`ml-auto w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            ) : (
              item.path && (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-colors
                    ${
                      active
                        ? "dark:bg-[#1F254A] bg-gray-100 text-indigo-500"
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                    }`}
                >
                  {item.iconUrl && (
                    <SvgIcon
                      url={item.iconUrl}
                      colorClass={active ? "text-indigo-500" : "text-gray-500"}
                    />
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              )
            )}
            {hasChildren &&
              isOpen &&
              renderRecursive(item.children!, level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0
        bg-white dark:bg-[#0C0F1F] text-gray-900 dark:text-white
        h-screen transition-all duration-300 ease-in-out z-50
        border-r border-gray-200 dark:border-[#1A1D2E]
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                src="/images/logo/logo.svg"
                alt="Logo"
                className="dark:hidden"
                width={150}
                height={40}
              />
              <img
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                className="hidden dark:block"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 flex flex-col gap-6">
          {Menus.map((group) => (
            <div key={group.title}>
              <h2
                className={`mb-2 text-xs uppercase text-gray-400 dark:text-gray-500 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? group.title : "⋯"}
              </h2>
              {renderRecursive(group.items)}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
