import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SettingsNavigation.scss";

const SettingsNavigation = ({ setSelectedComponent }) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleTabChange = (tab) => {
    setSelectedComponent(tab);
    navigate(`/dashboard/${userId}/settings?tab=${tab.toLowerCase()}`);
  };

  return (
    <nav className="settings-nav">
      <ul className="settings-nav__list">
        <li onClick={() => handleTabChange("Profile")}>Profile</li>
        <li onClick={() => handleTabChange("Password")}>Password</li>
        <li onClick={() => handleTabChange("Alerts")}>Alerts</li>
      </ul>
    </nav>
  );
};

export default SettingsNavigation;
