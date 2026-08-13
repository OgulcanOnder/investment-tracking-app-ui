import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, message } from "antd";
import "../style/LoginForm.css";
import { Login } from "../data/login";
import { login } from "../service/AuthenticationService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const storeLogin = useAuthStore((state) => state.login);
  const onFinish = async (values: Login) => {
    try {
      const response = await login(values);
      storeLogin(response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      message.success("Successful Sign in");

      navigate("/investment");
    } catch (error: any) {
      console.error(error.response);
      message.error("Email veya şifre hatalı");
    }
  };
  return (
    <div className="login-page-main">
      <div className="login-form-main">
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          className="login-form"
          onFinish={onFinish}
        >
          <h3>Sign in</h3>
          <Form.Item
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
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 8, message: "Password must be at least 8 characters" },
              { max: 255, message: "Password must be no more than 255 characters long" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Flex
              justify="space-between"
              align="center"
            >
              <a
                href="/forgot-password"
                style={{ color: "black", fontWeight: "bold" }}
              >
                Forgot Password
              </a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              block
              htmlType="submit"
              className="sign-button"
            >
              Sign in
            </Button>
            or{" "}
            <a
              href="/register"
              style={{ color: "black", fontWeight: "bold" }}
            >
              Register Now!
            </a>
          </Form.Item>
        </Form>{" "}
      </div>
    </div>
  );
};
export default LoginPage;
