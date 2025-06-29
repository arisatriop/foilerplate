import Role from "../../../components/manage/role/Role";

export default function RoleLayout() {
  return (
    <>
      <div className="flex flex-col w-full h-full p-6 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Role Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your roles and their permissions.
        </p>
      </div>

      <div className="flex-1 p-6 bg-white dark:bg-gray-900">
        <Role />
      </div>
    </>
  );
}
