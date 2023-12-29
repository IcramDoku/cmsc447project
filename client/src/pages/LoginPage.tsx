import React, { useState } from 'react';
import Axios from 'axios';
import PwdRecovery from './PwdRecovery';


interface Props {
  onLogin: (username: string) => void;
  onCloseModal: () => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
  });

  const [isLogin, setIsLogin] = useState(true);
  const [error_message, setError_message] = useState('');
  const [isPwdRecoveryVisible, setIsPwdRecoveryVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password, email, confirmPassword } = formData;

    try {
      if (isLogin) {
        const response = await Axios.post(
          'https://cmsc447project.vercel.app/auth/login_user',
          { username, password }
        );

        if (response.status === 200) {
          onLogin(username);
          console.log('Logged in:', response.data);
        }
      } else {
        const response = await Axios.post(
          'https://cmsc447project.vercel.app/auth/create_user',
          { username, password, email, confirmPassword }
        );

        if (response.status === 201) {
          alert('Account created successfully');
          setError_message('');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      if (error.response) {
        setError_message(error.response.data.error);
        console.log(error_message);
      }
    }
  };

  const toggleLoginSignup = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      password: '',
      email: '',
      confirmPassword: '',
    });
    setError_message('');
  };

  const handlePwdRecovery = () => {
    setIsPwdRecoveryVisible(true);
  };

  return (
      <div className="flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-white">
          {isPwdRecoveryVisible ? (
            <PwdRecovery onCancel={() => setIsPwdRecoveryVisible(false)} />
          ) : (
            <>
              <h2 className="text-2xl mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
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
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>
              <p className="mt-4 text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  className="ml-2 text-blue-500"
                  onClick={toggleLoginSignup}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
              <p className="mt-4 text-gray-600">
                {'Forgot your password?'}
                <button
                  className="ml-2 text-blue-500"
                  onClick={handlePwdRecovery}
                >
                  {'Click Here'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
  );
};

export default LoginPage;
