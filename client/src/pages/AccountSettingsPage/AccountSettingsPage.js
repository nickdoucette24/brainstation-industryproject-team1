import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header/Header";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import SettingsNavigation from "../../components/SettingsNavigation/SettingsNavigation";
import AccountSettings from "../../components/AccountSettings/AccountSettings";
import AlertSettings from "../../components/AlertSettings/AlertSettings";
import "./AccountSettingsPage.scss";

const AccountSettingsPage = () => {
  const loggedIn = useAuth();

  if (!loggedIn) {
    return null;
  }

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
            <SettingsNavigation />
          </div>
          <div className="account-settings__section-container">
            <AccountSettings />{" "}
            {/* Add functionality to choose between either */}
            <AlertSettings /> {/* Still in progress */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AccountSettingsPage;
