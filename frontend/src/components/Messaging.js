import React, { useEffect, useState } from "react";
import "../App.css";
import "../index.css";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faMessage } from '@fortawesome/free-solid-svg-icons';


const Messaging = ({ title, content }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    
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
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
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
        //<Card style={{ width: '18rem' }}>
        //    Hello
        //</Card>
        <div>
      {/* <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{content}</p>
      <button onClick={openModal} className="mt-2 text-blue-500 underline cursor-pointer focus:outline-none">
        Open Modal
      </button> */}
      <button onClick={openModal}
                    className="button">
                    Messages <FontAwesomeIcon icon={faMessage} />
                </button>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Messages"
        style={modalStyles}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600">{content}</p>
          <button onClick={closeModal} className="button">
            Close Modal
          </button>
        </div>
      </Modal>
    </div>
    );
};
export default Messaging