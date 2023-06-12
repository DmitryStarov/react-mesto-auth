import React from "react";
import succesfully from "../image/successfully.svg";
import failure from "../image/failure.svg";

export default function InfoTooltip({ onClose, toolTipMessage }) {
  function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) onClose();
  }
  
  React.useEffect(() => {
    const handleEscClose = (evt) => {
      if (evt.key === "Escape") onClose();
    };
    if (toolTipMessage) document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [toolTipMessage]);

  return (
    <div
      className={`popup popup_type_info-tool ${
        toolTipMessage && "popup_opened"
      }`}
      onMouseDown={handleOverlayClick}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__button-close"
          onClick={onClose}
        />
        <img
          className="popup__info-image"
          src={toolTipMessage?.isSuccess ? succesfully : failure}
        />
        <h2 className="popup__title popup__title_info">
          {toolTipMessage?.text}
        </h2>
      </div>
    </div>
  );
}
