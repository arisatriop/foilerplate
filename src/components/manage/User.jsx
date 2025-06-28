import React, { useEffect, useState } from "react";
import { userList } from "../../lib/api/UserApi";
import { axiosGoilerplateInstance, axiosReqresInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { useLocalStorage } from "react-use";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import Badge from "../ui/badge/Badge";

export default function User() {
  const [users, setUsers] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

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
  }, [currentPage]);

  async function fetchUsers(limit, offset, searchTerm) {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await userList(
        axiosGoilerplateInstance,
        `Bearer ${accessToken}`,
        { limit, offset, keyword: searchTerm }
      );
      setUsers(response.data.data);
      setTotalItem(response.data.pagination.totalItem);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Whoops! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  const renderUsers = () => {
    return users.map((user, index) => (
      <TableRow key={user.id}>
        <TableCell className="px-4 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
          {index + 1}
        </TableCell>
        <TableCell className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img width={40} height={40} src={user.avatar} alt={user.name} />
            </div>
            <div>
              <span className="block font-medium text-theme-sm text-gray-800 dark:text-white/90">
                {user.name}
              </span>
              <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-5 py-3 text-theme-xs font-medium text-gray-500 dark:text-gray-400 space-x-1">
          {user?.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
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
            <Badge size="sm" color="secondary">
              -
            </Badge>
          )}
        </TableCell>
        <TableCell className="px-4 py-3 text-end text-theme-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => alert(`Edit ${user.name}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              <MdEdit className="w-5 h-5" />
            </button>
            <button
              onClick={() => confirm(`Delete ${user.name}`)}
              className="text-red-600 hover:text-red-800"
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
          + Create New
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
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
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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

          {/* Page Numbers */}
          {(() => {
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
          })()}

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
        </div>
      </div>
    </div>
  );
}
