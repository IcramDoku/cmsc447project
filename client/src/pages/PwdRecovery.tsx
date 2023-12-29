import React, { useState } from "react";
import Axios from "axios";

interface PwdRecoveryProps {
  onCancel: () => void;
}

const PwdRecovery: React.FC<PwdRecoveryProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [error_message, setError_message] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Username/Email, 2: Verification Code, 3: New Password

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { usernameOrEmail, newPassword, confirmPassword, verificationCode } = formData;

    try {
      switch (currentStep) {
        case 1:
          // Step 1: Send verification code request
          await Axios.post("https://cmsc447project.vercel.app/auth/password_recovery", { usernameOrEmail });
          //clear the error message so it doesn't persist after success
          setError_message("");
          setCurrentStep(2);
          break;

        case 2:
          // Step 2: Submit verification code
          if (!verificationCode) {
            setError_message("Verification code is required.");
            return;
          }

          // Validate the verification code on the server
          const verificationResponse = await Axios.post("https://cmsc447project.vercel.app/auth/validate_verification_code", {
            usernameOrEmail,
            verificationCode,
          });

          if (verificationResponse.status !== 200) {
            setError_message("Invalid verification code.");
            return;
          }

          //clear the error message so it doesn't persist after success
          setError_message("");

          setCurrentStep(3);
          break;

        case 3:
          // Step 3: Submit verification code and reset password
          const response = await Axios.post("https://cmsc447project.vercel.app/auth/verify_and_reset_password", {
            usernameOrEmail,
            verificationCode,
            newPassword,
            confirmPassword,
          });

          if (response.status === 200) {
            //clear the error message so it doesn't persist after success
            setError_message("");
            // Password recovery successful
            alert("Password changed successfully");
            onCancel(); // Close the password recovery form
          }
          break;

        default:
          break;
      }
    } catch (error: any) {
      if (error.response) {
        setError_message(error.response.data.error);
      }
    }
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <label className="block">Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
          </div>
        );

      case 2:
        return (
          <div>
            <label className="block">Verification Code</label>
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
          </div>
        );

      case 3:
        return (
          <div>
            <label className="block">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
            <label className="block">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">{"Password Recovery"}</h2>
      <form onSubmit={handleSubmit}>
        {renderForm()}
        <p className="mt-4 text-red-600">{error_message}</p>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {currentStep === 3 ? "Change Password" : "Next"}
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        {currentStep === 3
          ? "Go back: "
          : "Cancel: "}
        <button className="ml-2 text-blue-500" onClick={onCancel}>
          {currentStep === 3 ? "Cancel" : "Back"}
        </button>
      </p>
    </div>
  );
};

export default PwdRecovery;
