import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header/Header";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import SettingsNavigation from "../../components/SettingsNavigation/SettingsNavigation";
import ProfileSettings from "../../components/ProfileSettings/ProfileSettings";
import AlertSettings from "../../components/AlertSettings/AlertSettings";
import PasswordSettings from "../../components/PasswordSettings/PasswordSettings";
import "./AccountSettingsPage.scss";

const AccountSettingsPage = () => {
  const loggedIn = useAuth();
  const [selectedComponent, setSelectedComponent] = useState("Profile");

  if (!loggedIn) {
    return null;
  }

  const settingsComponents = {
    Profile: <ProfileSettings />,
    Password: <PasswordSettings />,
    Alerts: <AlertSettings />,
  };

  return (
    <div className="main-page">
      <div className="main-page__nav">
        <SideNavigation />
      </div>
      <main className="main-page__body">
        <div className="header-container">
          <Header />
        </div>
        <section className="account-settings">
          <div className="account-settings__nav-container">
            <SettingsNavigation setSelectedComponent={setSelectedComponent} />
          </div>
          <div className="account-settings__section-container">
            {settingsComponents[selectedComponent]}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AccountSettingsPage;
