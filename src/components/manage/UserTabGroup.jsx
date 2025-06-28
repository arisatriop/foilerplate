import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import UserMetaCard from "./UserMetaCard";

export default function UserTabGroup() {
  const categories = [
    {
      name: "Profile",
    },
    {
      name: "Roles",
    },
    {
      name: "Permission",
    },
  ];
  return (
    <div className="w-full pt-2">
      <TabGroup className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/5 p-3 shadow-sm">
        <TabList className="flex gap-4 justify-center">
          {categories.map(({ name }) => (
            <Tab
              key={name}
              className="rounded-full px-3 py-1 text-sm/6 font-semibold text-gray-600 dark:text-white focus:outline-none data-[selected]:bg-gray-100 dark:data-[selected]:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-3">
          <TabPanel
            key="Profile"
            className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 shadow-sm"
          >
            <UserMetaCard />
          </TabPanel>

          <TabPanel
            key="Roles"
            className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 shadow-sm"
          >
            <p className="text-sm text-gray-800 dark:text-white">Popular</p>
          </TabPanel>

          <TabPanel
            key="Permission"
            className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 shadow-sm"
          >
            <p className="text-sm text-gray-800 dark:text-white">Trending</p>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
