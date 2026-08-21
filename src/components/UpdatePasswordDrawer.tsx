import { LockOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, message, notification, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdatePassword } from "../data/UpdatePassword";
import { updatePassword } from "../service/AuthenticationService";
import { useAuthStore } from "../store/useAuthStore";
import "../style/UpdatePasswordDrawer.css";

const { Text } = Typography;

interface UpdatePasswordDrawerProps {
  open: boolean;
  onClose: () => void;
}

const UpdatePasswordDrawer = ({ open, onClose }: UpdatePasswordDrawerProps) => {
  const [form] = Form.useForm<UpdatePassword>();
  const [loading, setLoading] = useState(false);
  const storeLogout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: UpdatePassword) => {
    setLoading(true);
    try {
      await updatePassword(values);
      message.success("Password updated successfully.");
      handleClose();
      storeLogout();
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) {
          message.forEach((msg: string) => notification.error({ message: msg }));
        } else if (typeof message === "string") {
          notification.error({ message });
        } else {
          notification.error({ message: "Something went wrong." });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      className="upd-drawer"
      title={<span className="upd-drawer-title">Update Password</span>}
      placement="right"
      onClose={handleClose}
      open={open}
      width={420}
      footer={
        <div className="upd-drawer-footer">
          <Button
            className="upd-btn-cancel"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="upd-btn-primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Update Password
          </Button>
        </div>
      }
    >
      <div className="upd-drawer-content">
        <Text
          type="secondary"
          className="upd-hint-text"
        >
          Choose a strong password you haven't used before.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="upd-form"
        >
          <Form.Item
            label="Current Password"
            name="oldPassword"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 8, message: "Password must be at least 8 characters" },
              { max: 255, message: "Password must be no more than 255 characters long" },
              { pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*]).*$/, message: "Password must contain at least one digit, lowercase, uppercase, and special character" },
            ]}
            className="upd-form-item"
          >
            <Input.Password
              prefix={<LockOutlined className="upd-input-icon" />}
              placeholder="Current password"
              className="upd-input"
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 8, message: "Password must be at least 8 characters" },
              { max: 255, message: "Password must be no more than 255 characters long" },
              { pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*]).*$/, message: "Password must contain at least one digit, lowercase, uppercase, and special character" },
            ]}
            className="upd-form-item"
          >
            <Input.Password
              prefix={<LockOutlined className="upd-input-icon" />}
              placeholder="New password"
              className="upd-input"
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match."));
                },
              }),
            ]}
            className="upd-form-item"
          >
            <Input.Password
              prefix={<LockOutlined className="upd-input-icon" />}
              placeholder="Confirm new password"
              className="upd-input"
            />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default UpdatePasswordDrawer;
