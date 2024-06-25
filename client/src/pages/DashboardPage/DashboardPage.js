import { useParams } from "react-router-dom";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import Header from "../../components/Header/Header";
import DashboardMetrics from "../../components/DashboardMetrics/DashboardMetrics";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const { userId } = useParams();

  return (
    <div className="dashboard">
      <div className="dashboard__nav">
        <SideNavigation />
      </div>
      <main className="dashboard__body">
        <div className="header-container">
          <Header userId={userId} />
        </div>
        <section className="dashboard__main-content">
          <div className="dashboard__container">
            <DashboardMetrics />
           </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;