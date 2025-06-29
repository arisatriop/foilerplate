import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";

const DefaultIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const SvgIcon: React.FC<{
  url?: string;
  className?: string;
  isActive?: boolean;
}> = ({ url, className = "", isActive }) => {
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const colorClass = isActive
    ? "text-indigo-500"
    : "text-gray-900 dark:text-white";

  const wrapperClass = `w-4 h-4 ${colorClass} ${className}`;

  const sanitizeSvg = (raw: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, "image/svg+xml");
      const svg = doc.querySelector("svg");

      if (!svg) throw new Error("Invalid SVG");

      // Remove unwanted attributes
      svg.removeAttribute("class");
      svg.removeAttribute("width");
      svg.removeAttribute("height");

      const isStrokeBased =
        !!svg.getAttribute("stroke") || svg.innerHTML.includes("stroke=");

      if (isStrokeBased) {
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("fill", "none");
      } else {
        svg.setAttribute("fill", "currentColor");
        svg.removeAttribute("stroke");
      }

      // Fix children elements
      svg.querySelectorAll("*").forEach((el) => {
        if (isStrokeBased) {
          el.setAttribute("stroke", "currentColor");
          el.setAttribute("fill", "none");
        } else {
          el.setAttribute("fill", "currentColor");
          el.removeAttribute("stroke");
        }
      });

      return svg.outerHTML;
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    if (!url || url.trim() === "") {
      setSvgHtml(null);
      return;
    }

    if (url.trim().startsWith("<svg")) {
      setSvgHtml(sanitizeSvg(url));
      return;
    }

    let canceled = false;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.text();
      })
      .then((text) => {
        if (!canceled) {
          const sanitized = sanitizeSvg(text);
          setSvgHtml(sanitized || null);
        }
      })
      .catch(() => {
        if (!canceled) setError(true);
      });

    return () => {
      canceled = true;
    };
  }, [url]);

  if (error || !url || url.trim() === "" || !svgHtml) {
    return <DefaultIcon className={wrapperClass} />;
  }

  return (
    <div
      className={wrapperClass}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const isAnyChildActive = (children?: any[]): boolean => {
    return !!children?.some(
      (c) => c.path === location.pathname || isAnyChildActive(c.children)
    );
  };

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderRecursive = (items: any[], level = 0) => (
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
                <SvgIcon url={item.iconUrl} isActive={active} />
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
                  <SvgIcon url={item.iconUrl} isActive={active} />
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

  const Menus = [
    {
      title: "SUPER ADMIN",
      items: [
        {
          name: "Dashboard",
          iconUrl: "",
          path: "/",
        },
        {
          name: "Manage",
          iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
          children: [
            {
              name: "User",
              iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
</svg>
`,
              path: "/manage/user",
            },
            {
              name: "Role",
              iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z"/></svg>`,
              path: "/manage/role",
            },
            {
              name: "Menu",
              iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0503 12.0498L21 16.9996L16.0503 21.9493L14.636 20.5351L17.172 17.9988L4 17.9996V15.9996L17.172 15.9988L14.636 13.464L16.0503 12.0498ZM7.94975 2.0498L9.36396 3.46402L6.828 5.9988L20 5.99955V7.99955L6.828 7.9988L9.36396 10.5351L7.94975 11.9493L3 6.99955L7.94975 2.0498Z"></path></svg>`,
              path: "/manage/menu",
            },
          ],
        },
      ],
    },
    {
      title: "OWNER",
      items: [
        {
          name: "Manage",
          iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
          children: [
            {
              name: "User",
              iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
              path: "/manage/user",
            },
            {
              name: "Role",
              iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
              path: "/manage/role",
              children: [
                {
                  name: "User",
                  iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
                  path: "/manage/user",
                },
                {
                  name: "Role",
                  iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
                  path: "/manage/role",
                },
                {
                  name: "Menu",
                  iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
                  path: "/manage/menu",
                },
              ],
            },
            {
              name: "Menu",
              iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
              path: "/manage/menu",
            },
          ],
        },
      ],
    },
  ];

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
