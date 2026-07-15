import React from "react";
import { IoMdClose } from "react-icons/io";

const Draftinmodel = ({ onClose }) => {
  return (
    <div className="modal-overlay-sing" onClick={onClose}>
      <div className="modal-content-sing" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn-sing" onClick={onClose}>
          <IoMdClose className="w-[50px] h-[30px]" />
        </span>
        <p className="text-white">Saved And Edit Later On</p>
      </div>
    </div>
  );
};

export default Draftinmodel;
