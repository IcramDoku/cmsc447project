// LandingPage.tsx
import { useState } from "react";
import LoginPage from "./LoginPage";
import Modal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import backgroundImage from "./bg-image.jpg";

interface Props {
  onLogin: (username: string) => void;
}

const LandingPage = ({ onLogin }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between text-white bg-gray-900 h-screen relative overflow-y-auto"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      <header className=" text-center py-4">
        <h1 className="text-2xl font-bold"></h1>
      </header>

      <section className="container mx-auto flex justify-center items-center my-8">
        <div className="text-center px-4">
          <h1 className="text-4xl text-white font-bold mb-4">Welcome to TaskMeister!</h1>
          <p className="text-lg text-white mb-8 text-center">
            A simple and effective task planner for individuals and groups. Start
            organizing your tasks today.
          </p>
        </div>
      </section>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mx-auto max-w-md"
        onClick={openModal}
      >
        Sign Up/ Login
      </button>
      <div className="justify-center">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Login Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              border: "none",
              background: "none",
              padding: 0,
              position: "relative",
              top: "50%", // Center the modal vertically
              transform: "translateY(-50%)", // Center the modal vertically
              overflowY: "auto", // Enable vertical scrolling
              maxHeight: "80vh",
            },
          }}
        >
          <div className="absolute top-4 right-0 m-4 cursor-pointer">
            <FontAwesomeIcon
              icon={faTimes}
              onClick={closeModal}
              className="text-white text-2xl hover:text-gray-300"
            />
          </div>
          <LoginPage onLogin={onLogin} onCloseModal={closeModal} />
        </Modal>
      </div>


      <footer className="bg-prismDark text-white text-center py-4">
        <div className="flex flex-col items-center">
          <p className="mb-2">Contact us: the.task.meister.team@gmail.com</p>
          <p className="text-sm">Follow us on social media: @TaskMeister</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
