import { useEffect, useState, useRef } from "react";
import Axios from "axios";
import TaskGroup from "../components/TaskGroup";
import Calendar from "../components/Calendar";
import AllTasks from "../components/AllTasks";
import profileImage from "./profile-image.jpg";
import backgroundImage from "./bg-image.jpg";

interface Props {
  onLogout: (username: string) => void;
  username: string;
}

export const Dashboard = ({ onLogout, username }: Props) => {
  const storedView = sessionStorage.getItem("selectedView");
  const [selectedView, setSelectedView] = useState<string>(storedView || "TaskGroup");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [email, setEmail] = useState(null);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use Axios to make the API call
    Axios.get(`https://cmsc447project.vercel.app/auth/get_email/${username}`)
      .then(response => {
        // Update the state with the data from the API
        setEmail(response.data.email);
      })
      .catch(error => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }, [username]);

  useEffect(() => {
    sessionStorage.setItem("selectedView", selectedView);

    // Add a click event listener to handle closing the profile dropdown
    const handleClickOutside = (event: Event) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        // Clicked outside the profile circle, close the dropdown
        setIsProfileOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("click", handleClickOutside);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedView]);

  const handleSelectView = (view: string) => {
    setSelectedView(view);
    toggleProfile(); // Close the profile when a view is selected
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentGroupID");
    sessionStorage.removeItem("selectedView");
    sessionStorage.removeItem('isSidebarMembers');
    onLogout("");
  };

  const handleDeleteUser = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        await Axios.delete(`https://cmsc447project.vercel.app/auth/delete_user/${username}`);
        handleLogout();
      } catch (error) {
        console.error("Error deleting user account:", error);
      }
    }

    toggleProfile(); // Close the profile after deletion (whether successful or not)
  };

  return (
    <div className="flex flex-col bg-prismDarkPurple h-screen relative"
    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1)), url(${backgroundImage})`, backgroundSize: 'cover' }}>
      {/* Dropdown menu */}
      {isProfileOpen && (
        <div className="absolute left-1 mt-2 bg-white rounded-md shadow-md text-black-800 p-4">
          <div className="flex items-center mb-4">
            <img
              src={profileImage}
              className="w-10 h-10 rounded-full mr-3"
              alt="User Profile"
            />
            <div>
              <p className="text-lg font-semibold mb-1">Hello, {username}!</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <button
            onClick={() => handleSelectView("TaskGroup")}
            className="block px-4 py-2 w-full text-left mb-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Explore Task Groups
          </button>
          <button
            onClick={() => handleSelectView("Calendar")}
            className="block px-4 py-2 w-full text-left mb-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            Check the Calendar
          </button>
          <button
            onClick={() => handleSelectView("AllTasks")}
            className="block px-4 py-2 w-full text-left mb-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300"
          >
            View All Tasks
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 w-full text-left mb-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            🔒 Logout
          </button>
          <button
            onClick={handleDeleteUser}
            className="block px-4 py-2 w-full text-left text-red-500 hover:font-bold transition duration-300"
          >
            Delete My Account
          </button>
        </div>
      )}

  
      {/* Dropdown button and Navigation buttons */}
      <div className="flex justify-between items-center outline p-6 text-white">
        {/* Dropdown button */}
        <div className="" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center bg-gray-900 rounded-full cursor-pointer p-4 hover:bg-black focus:outline-none"
          >
            <img
              src={profileImage}
              alt="User Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-white">{username}</span>
          </button>
  
          {/* Line underneath dropdown button */}
          {isProfileOpen && (
            <div className="absolute left-0 bottom-0 w-full h-1 bg-gray-900" />
          )}
        </div>


        {/*our app logo*/}
        <p className="text-3xl font-bold text-white opacity-70">TaskMeister☑</p>

  
        {/* Navigation buttons */}
        <div className="flex space-x-1">
          {/* Rest of your buttons */}
          <button
            onClick={() => handleSelectView("TaskGroup")}
            className={`bg-blue-500 hover:bg-blue-500 focus:outline-none text-white px-4 py-2 rounded-md ${selectedView === "TaskGroup" ? "bg-opacity-100" : "bg-opacity-50"}`}
          >
            Task Group
          </button>
          <button
            onClick={() => handleSelectView("Calendar")}
            className={`bg-blue-500 hover:bg-blue-500 focus:outline-none text-white px-4 py-2 rounded-md ${selectedView === "Calendar" ? "bg-opacity-100" : "bg-opacity-50"}`}
          >
            Calendar
          </button>
          <button
            onClick={() => handleSelectView("AllTasks")}
            className={`bg-blue-500 hover:bg-blue-500 focus:outline-none text-white px-4 py-2 rounded-md ${selectedView === "AllTasks" ? "bg-opacity-100" : "bg-opacity-50"}`}
          >
            All Tasks
          </button>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="p-2 bg-prismDarkPurple text-white flex-grow">
        {selectedView === "TaskGroup" && <TaskGroup username={username} />}
        {selectedView === "Calendar" && <Calendar username={username}/>}
        {selectedView === "AllTasks" && <AllTasks username={username} />}
      </div>
    </div>
  );  
  
};

export default Dashboard;

