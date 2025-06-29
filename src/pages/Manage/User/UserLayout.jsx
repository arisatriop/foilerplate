import User from "../../../components/manage/user/User";

export default function UserLayout() {
  return (
    <>
      <div className="flex flex-col w-full h-full p-6 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          User Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your users and their roles.
        </p>
      </div>

      <div className="flex-1 p-6 bg-white dark:bg-gray-900">
        <User />
      </div>
    </>
  );
}
