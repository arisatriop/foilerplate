/* eslint-disable react/prop-types */
// @ts-nocheck
import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronRight, FiSave } from "react-icons/fi";
import { menuList } from "../../../lib/api/MenuApi";
import { axiosGoilerplateInstance } from "../../../lib/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function FormCreate() {
  const [menus, setMenus] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await menuList(
          axiosGoilerplateInstance,
          localStorage.getItem("accessToken")
        );
        setMenus(response.data.data);
      } catch (error) {
        console.log("error fetch menu: ", error);
        const message =
          error?.response?.data?.message || "Whoops! Something went wrong.";
        toast.error(message);
      }
    };

    fetchData();
  }, []);

  const togglePermission = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Send to backend:", selectedPermissions);
      // await saveRole({ permissionIds: selectedPermissions })
      toast.success("Role saved successfully!");
      navigate("/manage/role");
    } catch (error) {
      console.log("error saving role:", error);
      const message =
        error?.response?.data?.message || "Whoops! Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-4 pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {menus.map((menu) => (
        <AccordionItem
          key={menu.id}
          menu={menu}
          selectedPermissions={selectedPermissions}
          togglePermission={togglePermission}
        />
      ))}

      <div className="flex gap-4 justify-center py-6">
        <button
          type="button"
          onClick={() => navigate("/manage/role")}
          className="w-60 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:text-white dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 whitespace-nowrap"
        >
          ← Back to Role Management
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-60 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <FiSave className="w-4 h-4" />
          )}
          Confirm and Save
        </button>
      </div>
    </form>
  );
}

function AccordionItem({ menu, selectedPermissions, togglePermission }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <div className="flex items-center gap-2">
          {menu.icon && (
            <span
              className="w-5 h-5 inline-flex items-center justify-center align-middle"
              dangerouslySetInnerHTML={{ __html: menu.icon }}
            />
          )}
          {menu.name}
        </div>
        {menu.child.length > 0 || menu.permission.length > 0 ? (
          open ? (
            <FiChevronDown />
          ) : (
            <FiChevronRight />
          )
        ) : null}
      </button>

      {open && (
        <div className="px-4 pb-4 bg-white dark:bg-gray-900">
          {menu.permission.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 my-4">
                Permissions:
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
                {menu.permission.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span>{perm.name.split(":").pop()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {menu.child.length > 0 && (
            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-2 pt-2">
              {menu.child.map((child) => (
                <AccordionItem
                  key={child.id}
                  menu={child}
                  selectedPermissions={selectedPermissions}
                  togglePermission={togglePermission}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
