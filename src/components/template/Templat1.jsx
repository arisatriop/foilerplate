import { Fragment, useState } from "react";
import { Link } from "react-router";
import { Listbox, Transition } from "@headlessui/react";
import {
  FiCheck,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiSave,
} from "react-icons/fi";

const emails = ["user1@example.com", "user2@example.com", "user3@example.com"];

export default function Template1() {
  const [selectedEmails, setSelectedEmails] = useState([emails[0]]);

  const updateEmail = (index, value) => {
    const updated = [...selectedEmails];
    updated[index] = value;
    setSelectedEmails(updated);
  };

  const addEmailField = () => {
    setSelectedEmails([...selectedEmails, emails[0]]);
  };

  const removeEmailField = (index) => {
    const updated = [...selectedEmails];
    updated.splice(index, 1);
    setSelectedEmails(updated);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900/90 rounded-xl shadow-sm p-6 space-y-6">
      {/* Form */}
      <form className="space-y-4">
        {/* Name */}
        <div className="flex items-center">
          <label
            htmlFor="name"
            className="w-40 text-sm font-medium text-gray-700 dark:text-white"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter name"
          />
        </div>

        {/* Email Dropdowns */}
        <div className="flex items-start">
          <label
            htmlFor="email"
            className="w-40 pt-2 text-sm font-medium text-gray-700 dark:text-white"
          >
            Email(s)
          </label>

          <div className="flex-1 flex flex-col gap-2">
            {selectedEmails.map((email, idx) => {
              const isLast = idx === selectedEmails.length - 1;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <EmailDropdown
                    value={email}
                    onChange={(val) => updateEmail(idx, val)}
                  />

                  {isLast ? (
                    <button
                      type="button"
                      onClick={addEmailField}
                      title="Add another email"
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20 transition-colors"
                    >
                      <FiPlus className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeEmailField(idx)}
                      title="Remove this email"
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20 transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center py-6">
        <Link to="/manage/role" className="w-60">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:text-white dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 whitespace-nowrap"
          >
            ← Back to User Management
          </button>
        </Link>

        <Link to="/manage/role" className="w-60">
          <button
            type="button"
            onClick={() => console.log("Send to backend:", selectedEmails)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 whitespace-nowrap"
          >
            <FiSave className="w-4 h-4" />
            Confirm and Save
          </button>
        </Link>
      </div>
    </div>
  );
}

// Subkomponen EmailDropdown
function EmailDropdown({ value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-left text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <span className="block truncate">{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FiChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
            {emails.map((email, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-white"
                      : "text-gray-900 dark:text-white"
                  }`
                }
                value={email}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {email}
                    </span>
                    {selected && (
                      <span className="absolute left-2 inset-y-0 flex items-center text-blue-600 dark:text-blue-300">
                        <FiCheck className="w-4 h-4" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
