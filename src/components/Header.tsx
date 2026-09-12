import "../style/Header.css";
import "antd/dist/reset.css";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, IdcardOutlined, FundOutlined, LogoutOutlined, WalletOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Popover } from "antd";
import { useState } from "react";
import { JwtToken } from "../data/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { logoutRequest } from "../data/apiClient";
import { useAuthStore } from "../store/useAuthStore";

const getUser = (): JwtToken | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtToken>(token);
    return decoded;
  } catch {
    return null;
  }
};

const getInitials = (payload: JwtToken): string => {
  if (payload.username) {
    return `${payload.username[0]}`.toUpperCase();
  }
  return payload.sub?.[0]?.toUpperCase() ?? "U";
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();
  const storeLogout = useAuthStore((state) => state.logout);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error: any) {
      console.error(error.response);
      navigate("/login");
    } finally {
      storeLogout();
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  const guestContent = (
    <div>
      <p>
        <Link
          to="/login"
          className="login-link"
          onClick={hide}
        >
          <button className="login-button">Sign in</button>
        </Link>
      </p>
      <p>
        <Link
          to="/register"
          className="register-link"
          onClick={hide}
        >
          <button className="register-button">Register</button>
        </Link>
      </p>
    </div>
  );

  const userMenuItems: MenuProps["items"] = [
    {
      key: "greeting",
      label: <span style={{ fontWeight: 600, color: "#555" }}>{user?.username}</span>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: "Exchange",
      icon: <FundOutlined />,
      label: <Link to="/">Exchange</Link>,
    },
    {
      key: "Investment",
      icon: <FundOutlined />,
      label: <Link to="/investment">Investment</Link>,
    },

    {
      key: "Debt",
      icon: <WalletOutlined />,
      label: <Link to="/debts">Debt</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log Out",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="header-main">
      <div className="title">
        <Link to="">
          <h2>Exchange</h2>
        </Link>
      </div>
      <div className="page-links">
        {user ? (
          // ── Kullanıcı giriş yapmış ──
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              size="large"
              className="header-avatar"
            >
              {getInitials(user)}
            </Avatar>
          </Dropdown>
        ) : (
          // ── Kullanıcı giriş yapmamış ──
          <Popover
            content={guestContent}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              className="header-avatar"
            />
          </Popover>
        )}
      </div>
    </div>
  );
};
export default Header;
