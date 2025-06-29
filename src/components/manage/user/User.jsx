import { useEffect, useState } from "react";
import { axiosGoilerplateInstance } from "../../../lib/axios";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";
import { MdDeleteForever } from "react-icons/md";
import Badge from "../../ui/badge/Badge";
import { Link } from "react-router";
import { FaEye } from "react-icons/fa";
import { userDelete, userList } from "../../../lib/api/UserApi";

export default function User() {
  const itemsPerPage = 5;
  const [users, setUsers] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const totalPages = Math.ceil(totalItem / itemsPerPage);

  useEffect(() => {
    const offset = 0;
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(itemsPerPage, offset, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    fetchUsers(itemsPerPage, offset, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // @ts-ignore
  async function fetchUsers(limit, offset, searchTerm) {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await userList(axiosGoilerplateInstance, accessToken, {
        limit,
        offset,
        keyword: searchTerm,
      });
      setUsers(response.data.data);
      setTotalItem(response.data.pagination.totalItem);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Whoops! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  // @ts-ignore
  async function deleteUser(id) {
    setIsDeleting(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      await userDelete(axiosGoilerplateInstance, accessToken, id);
      return true;
    } catch (error) {
      // @ts-ignore
      if (error.response && error.response.status >= 500) {
        // @ts-ignore
        toast.error(error.response.data.message);
        return false;
      }
      // @ts-ignore
      toast.warn(error.response.data.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  // @ts-ignore
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    // @ts-ignore
    const success = await deleteUser(userToDelete.id);
    if (!success) return;

    // @ts-ignore
    toast.success(`${userToDelete.name} has been deleted.`);

    setDeleteModal(false);
    setUserToDelete(null);
    setCurrentPage(1);

    await fetchUsers(itemsPerPage, 0, searchTerm); // Call manually
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setUserToDelete(null);
  };

  const renderUsers = () => {
    return users.map((user, index) => (
      <TableRow
        key={
          // @ts-ignore
          user.id
        }
      >
        <TableCell className="px-4 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
          {index + 1}
        </TableCell>
        <TableCell className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                width={40}
                height={40}
                src={
                  // @ts-ignore
                  user.avatar
                }
                // @ts-ignore
                alt={user.name}
              />
            </div>
            <div>
              <span className="block font-medium text-theme-sm text-gray-800 dark:text-white/90">
                {
                  // @ts-ignore
                  user.name
                }
              </span>
              <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                {
                  // @ts-ignore
                  user.email
                }
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400 space-x-1">
          {
            // @ts-ignore
            user?.roles &&
            // @ts-ignore
            Array.isArray(user.roles) &&
            // @ts-ignore
            user.roles.length > 0 ? (
              // @ts-ignore
              user.roles.map((role, idx) => (
                <Badge
                  key={idx}
                  size="sm"
                  color={
                    role?.name === "Super Admin"
                      ? "error"
                      : role?.name === "Owner"
                      ? "warning"
                      : "primary"
                  }
                >
                  {role?.name || "-"}
                </Badge>
              ))
            ) : (
              <Badge
                size="sm"
                // @ts-ignore
                color="secondary"
              >
                -
              </Badge>
            )
          }
        </TableCell>
        <TableCell className="px-4 py-3 text-end text-theme-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-end gap-3">
            <Link
              to="/manage/user/detail"
              className="text-sm text-blue-400 hover:text-blue-800"
            >
              <FaEye className="w-5 h-5" />
            </Link>
            <button
              onClick={() => handleDeleteClick(user)}
              className="text-red-400 hover:text-red-800"
            >
              <MdDeleteForever className="w-5 h-5" />
            </button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const renderShimmerRows = () =>
    [...Array(itemsPerPage)].map((_, i) => (
      <TableRow key={i} className="animate-pulse">
        <TableCell className="px-4 py-3">
          <div className="w-5 h-4 rounded bg-gray-200 dark:bg-gray-700" />
        </TableCell>
        <TableCell className="px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="space-y-1">
              <div className="w-28 h-4 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="w-20 h-3 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        </TableCell>
        <TableCell className="px-5 py-3">
          <div className="w-16 h-4 rounded bg-gray-300 dark:bg-gray-700" />
        </TableCell>
        <TableCell className="px-4 py-3 text-end">
          <div className="flex justify-end gap-3">
            <div className="w-5 h-5 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="w-5 h-5 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
        </TableCell>
      </TableRow>
    ));

  const renderTable = () => {
    return (
      <Table>
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              isHeader
              className="w-12 px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              No.
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              User
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Role
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Action
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {isLoading ? (
            renderShimmerRows()
          ) : users.length > 0 ? (
            renderUsers()
          ) : (
            <TableRow>
              <TableCell
                // @ts-ignore
                colSpan={4}
                className="px-4 py-6 text-center text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const renderButtonPrev = () => {
    return (
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 text-sm rounded-md border transition duration-150 ${
          currentPage === 1
            ? "text-gray-400 border-gray-200 dark:text-gray-600 dark:border-gray-800 cursor-not-allowed"
            : "text-gray-800 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
        }`}
      >
        Prev
      </button>
    );
  };

  const renderNextButton = () => {
    return (
      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(totalItem / itemsPerPage))
          )
        }
        disabled={currentPage === Math.ceil(totalItem / itemsPerPage)}
        className={`px-3 py-1 text-sm rounded-md border transition duration-150 ${
          currentPage === Math.ceil(totalItem / itemsPerPage)
            ? "text-gray-400 border-gray-200 dark:text-gray-600 dark:border-gray-800 cursor-not-allowed"
            : "text-gray-800 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
        }`}
      >
        Next
      </button>
    );
  };

  const renderPageNumber = () => {
    return (() => {
      const pageNumbers = [];
      let start = Math.max(currentPage - 1, 1);
      let end = Math.min(start + 2, totalPages);
      if (end - start < 2) start = Math.max(end - 2, 1);
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 text-sm rounded-md border transition duration-150 ${
            currentPage === page
              ? "bg-blue-600 text-white font-bold border-blue-600"
              : "text-gray-800 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
          }`}
        >
          {page}
        </button>
      ));
    })();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1); // reset ke halaman 1 kalau ada perubahan pencarian
            setSearchTerm(e.target.value);
          }}
          className="w-full max-w-xs px-3 py-2 border rounded-md text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />
        <button
          onClick={() => alert("Create new resource clicked")}
          className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">{renderTable()}</div>

      <div className="flex items-center justify-between p-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {users.length > 0
            ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                currentPage * itemsPerPage,
                totalItem
              )} of ${totalItem} entries`
            : "Showing 0 of 0 entries"}
        </span>

        <div className="flex space-x-2">
          {/* Prev Button */}
          {renderButtonPrev()}

          {/* Page Numbers */}
          {renderPageNumber()}

          {/* Next Button */}
          {renderNextButton()}
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in"> */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete <br />
                <strong>
                  {
                    // @ts-ignore
                    userToDelete?.name
                  }{" "}
                  -{" "}
                  {
                    // @ts-ignore
                    userToDelete?.email
                  }
                </strong>
                ?
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              {!isDeleting && (
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition
                ${
                  isDeleting
                    ? "bg-red-400 cursor-not-allowed opacity-50"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
