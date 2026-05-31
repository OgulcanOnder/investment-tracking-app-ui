import "../style/Header.css";
import "antd/dist/reset.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="header-main">
      <div className="title">
        <Link to="">
          <h2>Exchange</h2>
        </Link>
      </div>
      <div className="page-links">
        <Link to="/investment">Investment</Link>
      </div>
    </div>
  );
};
export default Header;
