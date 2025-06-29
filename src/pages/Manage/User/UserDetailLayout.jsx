import { Link } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import UserTabGroup from "../../../components/manage/user/UserTabGroup";

export default function UserDetailLayout() {
  return (
    <>
      <PageMeta
        title="Roilerplate - Boilerplate React.js and Tailwind"
        description="This is React.js project template using Tailwind css including RBAC set up"
      />
      <UserTabGroup />
      <div className="w-full pt-2 flex flex-col items-center m-3">
        {/* Back button */}
        <div className="mb-4">
          <Link to="/manage/user">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:text-white dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20"
            >
              ← Back to User Management
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
