import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Register } from "../data/register";
import { register } from "../service/AuthenticationService";
import "../style/RegisterForm.css";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values: Register) => {
    try {
      await register(values);
      message.success("Successful Register");
      navigate("/login");
    } catch (error: any) {
      console.error(error.response);
      message.error("Unsuccessful Register");
    }
  };
  return (
    <div className="register-page-main">
      <div className="register-form-main">
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          className="register-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <h3>Register</h3>
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
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 8, message: "Password must be at least 8 characters" },
              { max: 255, message: "Password must be no more than 255 characters long" },
              { pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*]).*$/, message: "Password must contain at least one digit, lowercase, uppercase, and special character" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              htmlType="submit"
              className="register-form-button"
            >
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <a href="/login">
              <Button
                block
                className="sign-form-button"
              >
                Sign in
              </Button>
            </a>
          </Form.Item>
        </Form>{" "}
      </div>
    </div>
  );
};
export default RegisterPage;
