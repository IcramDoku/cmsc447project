import { useState } from "react";
import axios from "axios";

interface Props {
  groupID: string;
  isOwner: boolean;
  onGroupDelete: (groupID: string) => {};
  onGroupNameChange: (groupID: string, newGroupName: string) => {};
  onTaskAdd: (groupID: string) => {};
  refreshTask: () => {};
}

const Taskheader = ({
  groupID,
  isOwner,
  onGroupDelete,
  onGroupNameChange,
  onTaskAdd,
  refreshTask,
}: Props) => {
  const [changeNameView, setChangeNameView] = useState(false);
  const [newName, setNewName] = useState("");
  const onTaskDeleteAll = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all tasks?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://cmsc447project.vercel.app/group/delete_all_tasks/${groupID}`
        );
        console.log(response); 
      } catch (error) {
        console.error("Error:", error);
        // Handle errors or display error messages to the user
      }
      refreshTask();
    }
  };

  const handleAllTaskStatusChange = async (isFinish: boolean) => {
    try {
      const endpoint = isFinish ? "finish_all_tasks" : "unfinish_all_tasks";
      const response = await axios.put(
        `https://cmsc447project.vercel.app/group/${endpoint}/${groupID}`
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    refreshTask();
  };

  return (
    <>
      <div className="bg-prismDarkPurple content-right rounded-md">
        <button
          className="text-green-500 m-2 py-1 px-2 rounded hover:text-green-600"
          onClick={() => onTaskAdd(groupID)}
        >
          Add Task
        </button>
        <button
          className="text-blue-500 m-2 py-1 px-2 rounded hover:text-blue-600"
          onClick={() => handleAllTaskStatusChange(true)}
        >
          Finish All
        </button>
        <button
          className="text-gray-400 m-2 py-1 px-2 rounded hover:text-gray-500"
          onClick={() => handleAllTaskStatusChange(false)}
        >
          Unfinish All
        </button>
        {isOwner && (
          <>
            <button
              className="text-red-500 m-2 py-1 px-2 rounded hover:text-red-600"
              onClick={onTaskDeleteAll}
            >
              Delete All
            </button>
            {isOwner && (
              <button
                className="text-purple-500 ml-2 m-2 py-1 px-2 rounded hover:text-purple-600"
                onClick={() => setChangeNameView(!changeNameView)}
              >
                Change Name
              </button>
            )}
            {changeNameView && (
              <input
                type="text"
                placeholder="Change Group Name"
                className="rounded bg-prismDarkPurple outline-white outline text-white px-2"
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
              ></input>
            )}
            {changeNameView && (
              <button
                className="text-purple-500 ml-2 m-2 py-1 px-2 rounded hover:text-purple-600"
                onClick={() => {
                  setChangeNameView(!changeNameView);
                  onGroupNameChange(groupID, newName);
                  setNewName("");
                }}
              >
                Edit
              </button>
            )}
            {isOwner && (
              <button
                className="text-red-500 m-2 py-1 px-2 rounded hover:text-red-600"
                onClick={() => onGroupDelete(groupID)}
              >
                Delete Group
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Taskheader;
