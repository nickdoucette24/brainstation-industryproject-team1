import { Link, useNavigate, useParams } from "react-router-dom";
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
  const params = useParams();

  const handleDashboardNav = () => {
    if (loggedIn) {
      navigate(`/dashboard/${params.id}`);
    }
  };

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
              <img
                src={dashboardIcon}
                className="nav-list__item--dbicon"
                alt="dashboard icon"
              />
              <Link to={"/dashboard/:id"} className="nav-list__item--link">
                Dashboard
              </Link>
            </li>
            <li className="nav-list__item">
              <img
                src={productsIcon}
                className="nav-list__item--icon"
                alt="products icon"
              />
              <Link to={"/product-list"} className="nav-list__item--link">
                Products
              </Link>
            </li>
            <li className="nav-list__item">
              <img
                src={retailersIcon}
                className="nav-list__item--icon"
                alt="retailers icon"
              />
              <Link to={"/retailer/:id"} className="nav-list__item--link">
                Retailers
              </Link>
            </li>
          </ul>
        </div>
        <div className="nav-bar__content">
          <h4 className="nav-bar__content--heading">Preferences</h4>
          <ul className="nav-list">
            <li className="nav-list__item">
              <img
                src={settingsIcon}
                className="nav-list__item--icon"
                alt="settings icon"
              />
              <Link
                to={"/dashboard/:id/settings"}
                className="nav-list__item--link"
              >
                Settings
              </Link>
            </li>
            <li className="nav-list__item">
              <img
                src={accountIcon}
                className="nav-list__item--icon"
                alt="account icon"
              />
              <Link
                to={"/dashboard/:id/settings"}
                className="nav-list__item--link"
              >
                Account
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="logout-container">
        <img
          src={logoutIcon}
          className="logout-container__icon"
          alt="logout icon"
        />
        <button className="logout-container__button"></button>
      </div>
    </div>
  );
};

export default SideNavigation;
