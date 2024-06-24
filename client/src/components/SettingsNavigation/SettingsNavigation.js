import "./SettingsNavigation.scss";

const SettingsNavigation = ({ setSelectedComponent }) => {
  return (
    <nav className="settings-nav">
      <ul className="settings-nav__list">
        <li onClick={() => setSelectedComponent("Profile")}>Profile</li>
        <li onClick={() => setSelectedComponent("Password")}>Password</li>
        <li onClick={() => setSelectedComponent("Alerts")}>Alerts</li>
      </ul>
    </nav>
  );
};

export default SettingsNavigation;
