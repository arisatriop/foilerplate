import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";

const SvgIcon: React.FC<{
  url?: string;
  className?: string;
  isActive?: boolean;
}> = ({ url, className = "", isActive }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [error, setError] = useState(false);

  const colorClass = isActive
    ? "text-indigo-500"
    : "text-gray-900 dark:text-white";

  const wrapperClass = `w-5 h-5 inline-flex items-center justify-center ${colorClass} ${className}`;

  useEffect(() => {
    if (!url || url.trim() === "") {
      setError(true);
      return;
    }

    const loadSvg = async () => {
      try {
        let svgString = "";

        if (url.trim().startsWith("<svg")) {
          svgString = url;
        } else {
          const res = await fetch(url);
          if (!res.ok) throw new Error("Failed to fetch");
          svgString = await res.text();
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgEl = doc.querySelector("svg");

        if (!svgEl) throw new Error("SVG not found");

        // Clean unwanted attributes
        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        svgEl.removeAttribute("class");

        // Ensure viewBox exists
        if (!svgEl.hasAttribute("viewBox")) {
          svgEl.setAttribute("viewBox", "0 0 24 24");
        }

        // Keep original fill/stroke — do NOT override
        svgEl.classList.add("w-full", "h-full");

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(svgEl);
        }
      } catch (e) {
        setError(true);
      }
    };

    loadSvg();
  }, [url]);

  if (error) {
    return (
      <svg
        className={wrapperClass}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    );
  }

  return <span ref={containerRef} className={wrapperClass} />;
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
              iconUrl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
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
