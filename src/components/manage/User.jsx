import React, { useEffect, useState } from "react";
import { userList } from "../../lib/api/UserApi";
import { axiosGoilerplateInstance, axiosReqresInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { useEffectOnce, useLocalStorage } from "react-use";
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
  // const [id, setId] = useState("");
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [users, setUsers] = useState([]);

  async function fetchUsers(page, perPage) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await userList(
        axiosGoilerplateInstance,
        `Bearer ${accessToken}`,
        { page, perPage }
      );

      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Whoops! Something went wrong.");
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
          {user.roles.map((role, idx) => (
            <Badge
              key={idx}
              size="sm"
              color={
                role.name === "Super Admin"
                  ? "error"
                  : role.name === "Owner"
                  ? "warning"
                  : "primary"
              }
            >
              {role.name}
            </Badge>
          ))}
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

  useEffectOnce(() => {
    fetchUsers(1, 10).then(() => {
      console.log("Users fetched successfully");
    });
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <input
          type="text"
          placeholder="Search by name or email..."
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
            {users.length > 0 ? (
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
    </div>
  );
}
