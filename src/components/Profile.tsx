import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profile } from "../service/AuthenticationService";
import UpdatePasswordDrawer from "./UpdatePasswordDrawer";
const ProfilePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await profile();
        form.setFieldsValue({
          name: response.name,
          surname: response.surname,
          username: response.username,
          email: response.email,
        });
      } catch {}
    };
    getProfile();
  }, [form]);

  return (
    <div className="register-page-main">
      <div className="register-form-main">
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          className="register-form"
          layout="vertical"
        >
          <h3>Profile</h3>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input your Name!" },
              { min: 3, message: "Name must be at least 3 characters" },
              { max: 50, message: "Name must be no more than 50 characters long" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              disabled
            />
          </Form.Item>
          <Form.Item
            label="Surname"
            name="surname"
            rules={[
              { required: true, message: "Please input your Surname!" },
              { min: 3, message: "Surname must be at least 3 characters" },
              { max: 50, message: "Surname must be no more than 50 characters long" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Surname"
              disabled
            />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your Username!" },
              { min: 3, message: "Username must be at least 3 characters" },
              { max: 50, message: "Username must be no more than 50 characters long" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              disabled
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Enter a valid email address" },
              { min: 5, message: "Email must be at least 5 characters" },
              { max: 254, message: "Email must be no more than 254 characters long" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              disabled
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              className="register-form-button"
              onClick={() => setDrawerOpen(true)}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>{" "}
      </div>
      <UpdatePasswordDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
