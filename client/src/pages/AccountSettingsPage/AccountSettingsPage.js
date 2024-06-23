import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header/Header";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import SettingsNavigation from "../../components/SettingsNavigation/SettingsNavigation";
import AccountSettings from "../../components/AccountSettings/AccountSettings";
import "./AccountSettingsPage.scss";

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const loggedIn = useAuth();
  if (!loggedIn) {
    navigate("/auth");
    return null;
  }
  return (
    <>
      <Header />
      <SideNavigation />
      <section>
        <SettingsNavigation />
        <AccountSettings />
      </section>
    </>
  );
};

export default AccountSettingsPage;
