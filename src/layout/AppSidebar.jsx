import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { currentUser } from "../lib/api/AuthApi";
import { axiosGoilerplateInstance } from "../lib/axios";

const DefaultIcon = ({ className }) => (
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

const SvgIcon = ({ url, className = "", isActive }) => {
  const [svgHtml, setSvgHtml] = useState(null);
  const [error, setError] = useState(false);

  const colorClass = isActive
    ? "text-indigo-500"
    : "text-gray-900 dark:text-white";

  const wrapperClass = `w-4 h-4 ${colorClass} ${className}`;

  // @ts-ignore
  const sanitizeSvg = (raw) => {
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
      // @ts-ignore
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
          // @ts-ignore
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

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [menu, setMenu] = useState([]);

  const isActive = useCallback(
    // @ts-ignore
    (path) => location.pathname === path,
    [location.pathname]
  );

  // @ts-ignore
  const isAnyChildActive = (children) => {
    return !!children?.some(
      // @ts-ignore
      (c) => c.path === location.pathname || isAnyChildActive(c.children)
    );
  };

  // @ts-ignore
  const toggleMenu = (name) => {
    // @ts-ignore
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // @ts-ignore
  const renderRecursive = (items, level = 0) => (
    <ul className={level === 0 ? "space-y-2" : "ml-4 mt-2 space-y-1"}>
      {items.map(
        (
          // @ts-ignore
          item
        ) => {
          const hasChildren =
            Array.isArray(item.child) && item.child.length > 0;
          // @ts-ignore
          const isOpen = openMenus[item.name];
          const active = item.path
            ? isActive(item.path)
            : isAnyChildActive(item.child);

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
                  <SvgIcon url={item.icon} isActive={active} />
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
                    <SvgIcon url={item.icon} isActive={active} />
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                )
              )}
              {hasChildren && isOpen && renderRecursive(item.child, level + 1)}
            </li>
          );
        }
      )}
    </ul>
  );

  async function fetchCurrentUser() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await currentUser(axiosGoilerplateInstance, accessToken);
      setMenu(response.data.data.role);
    } catch (error) {
      console.error("Failed to fetch menu", error);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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
          {menu.map((group) => (
            <div
              key={
                // @ts-ignore
                group.name
              }
            >
              <h2
                className={`mb-2 text-xs uppercase text-gray-400 dark:text-gray-500 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen
                  ? // @ts-ignore
                    group.name
                  : "⋯"}
              </h2>
              {renderRecursive(
                // @ts-ignore
                group.menu
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
