import TaskHeader from "./TaskHeader";
import Group from "./Group";
import { useEffect, useState } from "react";
import Axios from "axios";
import Task from "./Task";
import Social from "./Social";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from "../pages/bg-image.jpg"

interface Props {
  username: string;
}

interface Group {
  _id: string;
  name: string;
  members: [];
}

interface Task {
  _id: string;
  groupId: string;
  name: string;
  description: string;
  assignedUsers: [];
  completed: boolean;
  createdAt: string;
  dueAt: string;
}

const TaskGroup = ({ username }: Props) => {
  const [listOfGroup, setListOfGroup] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    sessionStorage.getItem("currentGroupID") || null
  );
  const [currentGroupInfo, setCurrentGroupInfo] = useState({
    groupID: sessionStorage.getItem("currentGroupID") || "",
    isOwner: false,
    tasks: [],
    members: [],
  });

  const [isSidebarVisible, setSidebarVisibility] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarVisibility(!isSidebarVisible);
  };

  const [isSidebarMembers, setSidebarMembers] = useState<boolean>(
    sessionStorage.getItem('isSidebarMembers') === 'true' || true
  );

  const handleToggleSidebarMembers = () => {
    setSidebarMembers((prevValue: boolean) => {
      const newValue = !prevValue;
      sessionStorage.setItem('isSidebarMembers', String(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const storedValue = sessionStorage.getItem('isSidebarMembers');
    if (storedValue !== null) {
      //this change saves the users choice to hide or show members list
      setSidebarMembers(storedValue === 'true');
    }
  }, []);

  useEffect(() => {
    const storedGroupID = sessionStorage.getItem("currentGroupID") || "";
    if (storedGroupID) {
      onGroupChange(storedGroupID);
    }
    getListOfGroupIDs();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("currentGroupID", currentGroupInfo.groupID);
  }, [currentGroupInfo.groupID]);

  const formData = {
    name: "Group",
    members: [username],
  };

  const newTask = {
    groupId: currentGroupInfo.groupID,
    name: "Task",
    description: "",
    assignedUsers: [],
    completed: false,
    createdAt: new Date().toLocaleDateString,
    dueAt: "",
  };

  //State change function for currentGroupInfo
  const onGroupChange = async (groupID: string) => {
    try {
      //Get the tasks
      const taskResponse = await Axios.get(
        `https://cmsc447project.vercel.app/task/get_task_group/${groupID}`
      );
      const tasks = taskResponse.data;
      console.log(sessionStorage.getItem("currentGroupID"), "above members");
      //Get the members
      const memberResponse = await Axios.get(
        `https://cmsc447project.vercel.app/group/get_group_members/${groupID}`
      );
      const members = memberResponse.data;
      // Check if the user is one of the members
      const isMember = members.includes(username);
      // Check if the user is the owner
      const response = await Axios.get(
        `https://cmsc447project.vercel.app/group/check_owner/${username}/${groupID}`
      );
      await getListOfGroupIDs();
      if (isMember) {
        setCurrentGroupInfo({
          groupID,
          isOwner: response.data.message === "User is owner",
          tasks: tasks,
          members: members,
        });
      } else {
        // Handle the case where the user is not a member
        setCurrentGroupInfo({
          groupID: "",
          isOwner: false,
          tasks: [],
          members: [],
        });
        console.log("User is not a member of this group.");
      }
      console.log(currentGroupInfo);
    } catch (error) {
      console.error("Error fetching group ownership info:", error);
    }
  };

  //Gets the list of groups the user is part of
  const getListOfGroupIDs = async () => {
    try {
      const response = await Axios.get(
        `https://cmsc447project.vercel.app/group/get_groups/${username}`
      );
      setListOfGroup(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getListOfGroupIDs();
  }, []);

  //Creating a new group
  const handleGroupAdd = async () => {
    // Prompt the user for the group name
    const groupName = prompt("Enter New Group Name:");
  
    // Check if the user provided a group name
    if (groupName !== null && groupName.trim() !== "") {
      const { members } = formData;
  
      try {
        const response = await Axios.post(
          "https://cmsc447project.vercel.app/group/create_group",
          {
            name: groupName,
            members,
          }
        );
  
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
  
      getListOfGroupIDs();
    }
  };

  //Deleting a group
  const handleGroupDelete = async (groupID: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (isConfirmed) {
      try {
        const response = await Axios.delete(
          `https://cmsc447project.vercel.app/group/delete_group/${groupID}`
        );
        console.log(response);
        await getListOfGroupIDs();
        setCurrentGroupInfo({
          groupID: "",
          isOwner: false,
          tasks: [],
          members: [],
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  //Changing the group name
  const handleGroupNameChange = async (
    groupID: string,
    groupNewName: string
  ) => {
    try {
      const response = await Axios.put(
        `https://cmsc447project.vercel.app/group/edit_group_name/${groupID}/${groupNewName}`
      );
      console.log(response);
      await getListOfGroupIDs();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Refresh tasks a task used when we need to create/delete/edit tasks
  const handleRefreshTask = async () => {
    try {
      const taskResponse = await Axios.get(
        `https://cmsc447project.vercel.app/task/get_task_group/${currentGroupInfo.groupID}`
      );
      const tasks = taskResponse.data;
      setCurrentGroupInfo((prevGroupInfo) => ({
        ...prevGroupInfo,
        tasks: tasks,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Creating a new task
  const handleOnTaskAdd = async () => {
    try {
      const response = await Axios.post(
        `https://cmsc447project.vercel.app/task/create_task`,
        newTask
      );
      await handleRefreshTask();
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add/Delete a new member to the group
  const handleAddMember = async (username: string) => {
    try {
      const response = await Axios.put(
        `https://cmsc447project.vercel.app/group/add_member/${username}/${currentGroupInfo.groupID}`
      );

      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    onGroupChange(currentGroupInfo.groupID);
  };

  const handleDeleteMember = async (username: string) => {
    try {
      const response = await Axios.put(
        `https://cmsc447project.vercel.app/group/remove_member/${username}/${currentGroupInfo.groupID}`
      );

      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    onGroupChange(currentGroupInfo.groupID);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {isSidebarVisible && (
      <aside className="w-1/6 p-4 text-white h-screen overflow-y-auto overflow-x-hidden bg-gray-900 rounded-md pb-40">
        {/* Your sidebar content */}
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-1">
            {/* Rest of your sidebar content */}
            <button
              className="w-full bg-prismGroupInput border-2 border-gray-900 rounded-md py-3 my-2 text-center text-lg font-semibold hover:bg-opacity-70 focus:outline-none"
              onClick={handleGroupAdd}
            >
              Create Group
            </button>
            {listOfGroup.map((group) => (
              <button
                key={group._id}
                className={`w-full block border-2 rounded-md border-gray-500 p-3 my-2 hover:bg-blue-900 focus:outline-none ${
                  // Show which group is selected by deep blue color
                  selectedGroup === group._id ? 'bg-blue-900 text-white' : ''
                }`}
                onClick={() => {
                  setSelectedGroup(group._id);
                  onGroupChange(group._id);
                }}
              >
                {group.name}
              </button>
            ))}
          </div>
          
        </div>
      </aside>
      )}

      {/* Toggle Sidebar Button */}
      <button
        className="absolute bottom-4 left-4 w-8 h-8 bg-gray-900 text-white p-2 rounded-md hover:bg-opacity-70 focus:outline-none"
        onClick={handleToggleSidebar}
      >
        <FontAwesomeIcon icon={isSidebarVisible ? faChevronLeft : faChevronRight} />
      </button>

      {/* Main Content */}
      <main className="bg-black rounded-md flex-1 p-4 h-screen flex flex-col pb-40"
      style={{
        background: currentGroupInfo.groupID ? 'black' : `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),url(${backgroundImage})`,
        backgroundSize: 'cover',
      }}
      >
        {currentGroupInfo.groupID ? (
          <>
          <TaskHeader
            refreshTask={handleRefreshTask}
            groupID={currentGroupInfo.groupID}
            isOwner={currentGroupInfo.isOwner}
            onGroupNameChange={handleGroupNameChange}
            onGroupDelete={() => handleGroupDelete(currentGroupInfo.groupID)}
            onTaskAdd={() => handleOnTaskAdd()}
          ></TaskHeader>
          {currentGroupInfo.tasks && (currentGroupInfo.tasks as Task[]).length > 0 ? (
            <div className="h-5/5 overflow-y-auto">
              <div>
                <h1 className="text-gray-300">Uncompleted Task(s):</h1>
                {currentGroupInfo.tasks &&
                  (currentGroupInfo.tasks as Task[]).map(
                    (task) =>
                      !task.completed && (
                        <Task
                          key={task._id}
                          {...task}
                          members={currentGroupInfo.members}
                          onTaskRefresh={handleRefreshTask}
                        ></Task>
                      )
                  )}
              </div>
              
              <div>
                <h1 className="text-gray-300">Completed Task(s):</h1>
                {currentGroupInfo.tasks &&
                  (currentGroupInfo.tasks as Task[]).map(
                    (task) =>
                      task.completed && (
                        <Task
                          key={task._id}
                          {...task}
                          members={currentGroupInfo.members}
                          onTaskRefresh={handleRefreshTask}
                        ></Task>
                      )
                  )}
              </div>
            </div>
          ) : (
            <div className="h-5/5 overflow-y-auto">
              <p className="upcoming-title">Please Add Task To Start!</p>
            </div>
          )}
          </>
        ) : (
          <h1 className="upcoming-title">Select or create a group to get started</h1>
        )}
      </main>

      {/* Sidebar for Members, only when a group is selected */}
      {isSidebarMembers && currentGroupInfo.groupID && (
        <aside className="w-1/6 p-4 pb-40 text-white h-screen overflow-y-auto overflow-x-hidden bg-gray-900 rounded-md">
          <div className=" overflow-y-auto ">
            {currentGroupInfo.groupID && (
              <Social
                username={username}
                isOwner={currentGroupInfo.isOwner}
                users={currentGroupInfo.members}
                onMemberAdd={handleAddMember}
                onMemberDelete={handleDeleteMember}
              ></Social>
            )}
          </div>
        </aside>
      )}
      {currentGroupInfo.groupID &&(
        <button
          className="toggle-sidebar-button absolute bottom-4 right-4 w-8 h-8 bg-gray-900 text-white p-2 rounded-md hover:bg-opacity-70 focus:outline-none"
          onClick={handleToggleSidebarMembers}
        >
          <FontAwesomeIcon icon={isSidebarMembers ? faChevronRight : faChevronLeft} />
        </button>
      )}
    </div>
  );
};

export default TaskGroup;
