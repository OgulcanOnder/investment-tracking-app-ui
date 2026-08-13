import { LockOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, message, notification, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdatePassword } from "../data/UpdatePassword";
import { updatePassword } from "../service/AuthenticationService";
import { useAuthStore } from "../store/useAuthStore";

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
      title="Update Password"
      placement="right"
      onClose={handleClose}
      open={open}
      width={420}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Update Password
          </Button>
        </div>
      }
    >
      <Text
        type="secondary"
        style={{ display: "block", marginBottom: 24 }}
      >
        Choose a strong password you haven't used before.
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
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
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Current password"
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
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="New password"
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
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm new password"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UpdatePasswordDrawer;
