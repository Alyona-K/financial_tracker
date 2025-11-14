import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import "./ConfirmModal.scss";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string; 
  message?: string; 
  confirmText?: string; 
  cancelText?: string; 
  onConfirm: () => void;
  onCancel: () => void;
  confirmClassName?: string;
  cancelClassName?: string;
  wrapperClassName?: string; 
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "",
  message = "",
  confirmText = "",
  cancelText = "",
  onConfirm,
  onCancel,
  confirmClassName,
  cancelClassName,
  wrapperClassName,
}) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className={`confirm-modal__body ${wrapperClassName || ""}`}>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__buttons">
          <Button
            className={`btn btn--medium btn--confirm ${confirmClassName || ""}`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            className={`btn btn--medium btn--cancel ${cancelClassName || ""}`}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
