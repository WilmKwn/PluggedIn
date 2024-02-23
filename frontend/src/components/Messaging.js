import React, { useState } from "react";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Messaging = ({ title }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const profileImages = ["/PFP1.jpg", "/PFP2.jpg", "/PFP3.jpg", "/PFP4.jpg", "/PFP1.jpg", "/PFP2.jpg", "/PFP3.jpg", "/PFP4.jpg"];

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const modalStyles = {
    content: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 'auto',
      top: 'auto',
      marginRight: '10px',
      marginBottom: '10px',
      border: 'none',
      background: 'white',
      overflow: 'hidden',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '5px',
      outline: 'none',
      padding: '20px',
      minWidth: '800px',
      height: '600px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  };

  return (
    <div>
      <button onClick={openModal} className="button">
        Messages <FontAwesomeIcon icon={faMessage} />
      </button>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Messages"
        style={modalStyles}
      >
        <div className="modal-container">
          <header className="flex">
            <div className="messaging-banner flex justify-between items-center">
              <h2 className="text-2xl p-5 text-white font-bold mb-4">{title}</h2>
              <button onClick={closeModal} className="button m-5">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </header>
          <div className="text-center">
            {/* Other content in the center if any */}
          </div>
          <div className="flex-1 flex overflow-y-hidden">
            {/* Sidebar with profile images */}
            <div className="w-1/4 p-4 bg-gray-100 overflow-y-scroll" style={{ marginBottom: '5px', height: '475px', borderRadius: '5px' }}>
              {profileImages.map((profileImage, index) => (
                <div key={index} className="flex items-center border-b border-gray-300 p-2">
                  <div>
                    <img
                      src={profileImage}
                      alt={`Profile ${index + 1}`}
                      className="w-12 h-12 rounded-full cursor-pointer"
                      onClick={() => console.log(`Clicked on profile ${index + 1}`)}
                    />
                  </div>
                  {/* You can add more details or actions for each profile card */}
                  <div className="ml-4">
                    <p className="text-gray-800 font-semibold">User {index + 1}</p>
                    {/* Add more information or actions here */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messaging;
