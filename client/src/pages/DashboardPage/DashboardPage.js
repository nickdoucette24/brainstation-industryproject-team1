import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/dashboard/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUser(response.data);
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/auth");
      }
    };

    fetchUser();
  }, [id, navigate]);
  return <>{!user ? <div>Loading...</div> : <div>DashboardPage</div>}</>;
};

export default DashboardPage;
