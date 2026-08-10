import { Button, Form, Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { ForgotPassword } from "../data/ForgotPassword";
import { forgotPassword } from "../service/AuthenticationService";
import "../style/ForgotPassword.css";

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const onFinish = async (values: ForgotPassword) => {
    try {
      await forgotPassword(values);
      message.success("If the email is registered,you will get a reset link");
    } catch (error: any) {
      console.error(error.response);
      message.error("Unsuccessful forgot password");
    }
  };
  return (
    <div className="forgot-password-page-main">
      <div className="forgot-password-form-main">
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          className="forgot-password-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <h3>Forgot Password</h3>
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

          <Form.Item>
            <Button
              block
              htmlType="submit"
              className="forgot-password-form-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>{" "}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
