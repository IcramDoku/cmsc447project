import { useState } from "react";
import Axios from "axios"; // Import Axios - for backend interaction

interface Props {
  onLogin: (username: string) => void;
}

const LoginPage = ({ onLogin }: Props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  //Determin if the user is in Login or SignUp page
  const [isLogin, setIsLogin] = useState(true);

  //Determine the current error if there is one
  const [error_message, setError_message] = useState("");

  //Saves the current change
  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const { username, password, email, confirmPassword } = formData;
    console.log(formData);
    try {
      if (isLogin) {
        const response = await Axios.post(
          "http://localhost:3000/auth/login_user",
          {
            username,
            password,
          }
        );
        if (response.status === 200) {
          onLogin(username);
          console.log("Logged in:", response.data);
        }
      } else {
        // If it's a sign-up, send a POST request to your sign-up endpoint
        const response = await Axios.post(
          "http://localhost:3000/auth/create_user",
          {
            username,
            password,
            email,
            confirmPassword,
          }
        );
        if (response.status === 201) {
          alert("Account created successfully");
          setError_message("");
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      // Add type 'any' to avoid 'unknown' error type error
      if (error.response) {
        // Error message used to display to user,
        // we need to use .error to specify 'error' form the whole object being returned
        setError_message(error.response.data.error);
        console.log(error_message); // Print the error for developer too
      }
    }
  };

  const toggleLoginSignup = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    });
    setError_message("");
  };

  window.onload = () => {
    console.log("on page load ran");
    //check cookie storage idea:
    //if cookie found, attempt to login with cookie
    //in order for this to work, the database needs a new collection that contains {session, username}
    //server can either accept the login or reject, if reject then client-side js should delete the cookie
    //sessions on the server expire/get deleted in a week
    //a user can have multiple sessions
    //if a user logs out, js should run on the client side to delete their cookie
    //
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-prismDarkPurple">
      <div className="bg-prismLightPurple p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {!isLogin && (
              <>
                <label className="block">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded text-gray-800"
                  required
                />
              </>
            )}
            <label className="block">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
            <label className="block ">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
            {!isLogin && (
              <>
                <label className="block">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded text-gray-800"
                  required
                />
              </>
            )}
            <p className="mt-4 text-red-600">{error_message}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="ml-2 text-blue-500" onClick={toggleLoginSignup}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
