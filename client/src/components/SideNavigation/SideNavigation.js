import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import spectraLogo from "../../assets/images/logos/dell-spectra-logo-wh.svg";
import dashboardIcon from "../../assets/icons/dashboard-icon.svg";
import productsIcon from "../../assets/icons/products-icon.svg";
import retailersIcon from "../../assets/icons/retailers-icon.svg";
import settingsIcon from "../../assets/icons/settings-icon.svg";
import accountIcon from "../../assets/icons/account-icon.svg";
import logoutIcon from "../../assets/icons/logout-icon.svg";

import "./SideNavigation.scss";

const SideNavigation = () => {
  const loggedIn = useAuth();
  const navigate = useNavigate();
  const { userId, retailerId } = useParams();
  const location = useLocation();

  const handleDashboardNav = () => {
    if (loggedIn) {
      navigate(`/dashboard/${userId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="nav-container">
      <div className="logo-container">
        <img
          src={spectraLogo}
          className="logo-container__image"
          alt="dell spectra main logo"
          onClick={handleDashboardNav}
        />
      </div>
      <nav className="nav-bar">
        <div className="nav-bar__content">
          <h4 className="nav-bar__content--heading">Insights</h4>
          <ul className="nav-list">
            <li className="nav-list__item">
              <Link
                to={`/dashboard/${userId}`}
                className={`nav-list__link ${
                  isActive(`/dashboard/${userId}`) ? "selected" : ""
                }`}
              >
                <img
                  src={dashboardIcon}
                  className={`nav-list__link--dbicon ${
                    isActive(`/dashboard/${userId}`) ? "db-selected" : ""
                  }`}
                  alt="dashboard icon"
                />
                <p className="nav-list__link--text">Dashboard</p>
              </Link>
            </li>
            <li
              className={`nav-list__item ${
                isActive(`/product-list`) ? "selected" : ""
              }`}
            >
              <Link
                to={"/product-list"}
                className={`nav-list__link ${
                  isActive("/product-list") ? "selected" : ""
                }`}
              >
                <img
                  src={productsIcon}
                  className={`nav-list__link--icon ${
                    isActive("/product-list") ? "selected-icon" : ""
                  }`}
                  alt="products icon"
                />
                <p className="nav-link--text">Products</p>
              </Link>
            </li>
            <li className="nav-list__item">
              <Link
                to={`/retailer/${retailerId}`}
                className={`nav-list__link ${
                  isActive(`/retailer/${retailerId}`) ? "selected" : ""
                }`}
              >
                <img
                  src={retailersIcon}
                  className={`nav-list__link--icon ${
                    isActive(`/retailer/${retailerId}`) ? "selected-icon" : ""
                  }`}
                  alt="retailers icon"
                />
                <p className="nav-list__link--text">Retailers</p>
              </Link>
            </li>
          </ul>
        </div>
        <div className="nav-bar__content">
          <h4 className="nav-bar__content--heading">Preferences</h4>
          <ul className="nav-list">
            <li className="nav-list__item">
              <Link
                to={`/dashboard/${userId}/settings`}
                className={`nav-list__link ${
                  isActive(`/dashboard/${userId}/settings`) ? "selected" : ""
                }`}
              >
                <img
                  src={accountIcon}
                  className={`nav-list__link--icon ${
                    isActive(`/dashboard/${userId}/settings`)
                      ? "selected-icon"
                      : ""
                  }`}
                  alt="account icon"
                />
                <p className="nav-list__link--text">Account</p>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="nav-list logout">
        <li className="nav-list__item">
          <Link to="/auth" onClick={handleLogout} className="nav-list__link">
            <img
              src={logoutIcon}
              className="nav-list__link--icon"
              alt="logout icon"
            />
            <p className="nav-list__link--text">Log out</p>
          </Link>
        </li>
      </div>
    </div>
  );
};

export default SideNavigation;
