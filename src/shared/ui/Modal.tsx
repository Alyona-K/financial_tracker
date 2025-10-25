import React from "react";
import { motion, Variants, cubicBezier } from "framer-motion";
import sprite from "@/assets/images/sprite.svg";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: cubicBezier(0.25, 0.1, 0.25, 1),
    },
  },
  exit: { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.2 } },
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="modal__backdrop"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
    >
      <motion.div className="modal__content" variants={modalVariants}>
        <div className="modal__header">
          <h3 className="modal__header-text">{title}</h3>
          {onClose && (
            <button className="modal__close" onClick={onClose}>
              <svg className="modal__close-icon" width={22} height={22}>
                <use xlinkHref={`${sprite}#close-icon`} />
              </svg>
            </button>
          )}
        </div>
        <div className="modal__body">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;

