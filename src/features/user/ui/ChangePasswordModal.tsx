import React, { useState } from "react";
import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import "./ChangePasswordModal.css";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onCancel,
  onSave,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    if (!currentPassword) newErrors.current = "Current password is required";
    if (!newPassword) newErrors.new = "New password is required";
    if (newPassword !== confirmPassword)
      newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await onSave(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onCancel(); // закрываем модалку
    } catch (err: any) {
      // сервер вернул ошибку текущего пароля
      setErrors({
        current: err.response?.data?.message || "Incorrect current password",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Change Password">
      <div className="change-password-modal">
        <div className="change-password-modal__input-container">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            wrapperClassName="change-password-modal__input-wrap"
            fieldClassName="change-password-modal__field"
            labelClassName="change-password-modal__label"
          />
          {errors.current && (
            <span className="change-password-modal__error">
              {errors.current}
            </span>
          )}
        </div>
        <div className="change-password-modal__input-container">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            wrapperClassName="change-password-modal__input-wrap"
            fieldClassName="change-password-modal__field"
            labelClassName="change-password-modal__label"
          />
          {errors.new && (
            <span className="change-password-modal__error">{errors.new}</span>
          )}
        </div>
        <div className="change-password-modal__input-container">
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            wrapperClassName="change-password-modal__input-wrap"
            fieldClassName="change-password-modal__field"
            labelClassName="change-password-modal__label"
          />
          {errors.confirm && (
            <span className="change-password-modal__error">
              {errors.confirm}
            </span>
          )}
        </div>

        <div className="change-password-modal__buttons">
          <Button
            className="btn btn--medium btn--confirm"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button className="btn btn--medium btn--cancel" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
