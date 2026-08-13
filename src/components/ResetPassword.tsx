import { Button, Form, Input, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { ResetPassword } from "../data/ResetPassword";
import { resetPassword } from "../service/AuthenticationService";
import "../style/ResetPassword.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ResetPasswordPage = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const storeLogout = useAuthStore((state) => state.logout);
  const onFinish = async (values: ResetPassword) => {
    try {
      if (!token) {
        message.error("Invalid reset password link");
        return;
      }
      const resetPasswordRequest: ResetPassword = {
        newPassword: values.newPassword,
        token: token,
      };
      await resetPassword(resetPasswordRequest);
      message.success("Reset Password Successful");
      storeLogout();
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error: any) {
      console.error(error.response);
      message.error("Unsuccessful reset password");
    }
  };
  return (
    <div className="reset-password-page-main">
      <div className="reset-password-form-main">
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          className="reset-password-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <h3>Reset Password</h3>
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
              type="password"
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              htmlType="submit"
              className="reset-password-form-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>{" "}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
