import React, { useState, useMemo } from "react";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { MdEdit, MdDeleteForever } from "../../icons";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    email: string;
  };
  roles: string[];
}

const tableData: Order[] = [
  {
    id: 6,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Ethan Wright",
      email: "ethanwright@gmail.com",
    },
    roles: ["Superadmin"],
  },
  {
    id: 7,
    user: {
      image: "/images/user/user-19.jpg",
      name: "Sofia Lee",
      email: "sofialee@gmail.com",
    },
    roles: ["Owner"],
  },
  {
    id: 8,
    user: {
      image: "/images/user/user-29.jpg",
      name: "Noah Harris",
      email: "noahharris@gmail.com",
    },
    roles: ["Editor", "Reader"],
  },
  {
    id: 9,
    user: {
      image: "/images/user/user-27.jpg",
      name: "Ava Scott",
      email: "avascott@gmail.com",
    },
    roles: ["Editor", "Reader"],
  },
  {
    id: 10,
    user: {
      image: "/images/user/user-22.jpg",
      name: "Liam Young",
      email: "liamyoung@gmail.com",
    },
    roles: ["Reader"],
  },
  {
    id: 11,
    user: {
      image: "/images/user/user-25.jpg",
      name: "Isabella Hall",
      email: "isabellahall@gmail.com",
    },
    roles: ["Reader"],
  },
  {
    id: 12,
    user: {
      image: "/images/user/user-26.jpg",
      name: "Mason Allen",
      email: "masonallen@gmail.com",
    },
    roles: ["Reader"],
  },
  {
    id: 13,
    user: {
      image: "/images/user/user-24.jpg",
      name: "Mia Nelson",
      email: "mianelson@gmail.com",
    },
    roles: ["Reader"],
  },
];

const ITEMS_PER_PAGE = 5;

export default function OldUser() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return tableData.filter(
      (item) =>
        item.user.name.toLowerCase().includes(search.toLowerCase()) ||
        item.user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search & Create Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
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

      {/* Table */}
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
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={order.user.image}
                        alt={order.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-theme-sm text-gray-800 dark:text-white/90">
                        {order.user.name}
                      </span>
                      <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                        {order.user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {order.roles.map((role, idx) => (
                      <Badge
                        key={idx}
                        size="sm"
                        color={
                          role === "Superadmin"
                            ? "error"
                            : role === "Owner"
                            ? "warning"
                            : "primary"
                        }
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  <div className="flex gap-3">
                    <button
                      onClick={() => alert(`Edit ${order.user.name}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirm(`Delete ${order.user.name}?`)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDeleteForever className="w-5 h-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {filteredData.length > 0
            ? `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredData.length
              )} of ${filteredData.length} entries`
            : "Showing 0 of 0 entries"}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
