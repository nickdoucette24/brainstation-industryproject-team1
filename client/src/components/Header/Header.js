import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import searchIcon from "../../assets/icons/search-icon.svg";
import accountIcon from "../../assets/icons/person-icon.svg";
import alertIcon from "../../assets/icons/alert-icon.svg";
import "./Header.scss";

// Base Url for get requests
const url = process.env.REACT_APP_BASE_URL;

const Header = () => {
  const [user, setUser] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  // const navigate = useNavigate();
  const { userId } = useParams();
  const loggedIn = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (loggedIn) {
        try {
          const response = await axios.get(`${url}/dashboard/${userId}`);
          setUser(response.data);
        } catch (error) {
          console.error(error.message);
        }
      } else {
      }
    };

    fetchUserData();
  }, [userId, loggedIn]);

  return (
    <header className="header-bar">
      <div className="header-wrapper">
        <div className="header-wrapper__search">
          <img
            src={searchIcon}
            className="header-wrapper__search--icon"
            alt="magnifying glass seach icon"
          />
          <input
            className={`header-wrapper__search--input ${
              isTyping ? "typing" : ""
            }`}
            type="search"
            placeholder="Search"
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
        </div>
        <div className="header-wrapper__content">
          <Link to={`/dashboard/${userId}/settings`} className="alerts-link">
            <img
              src={alertIcon}
              className="alerts-link__icon"
              alt="bell icon for the alert icon"
            />
          </Link>
          <div className="user-info">
            <div className="user-info__titles">
              <h5 className="user-info__titles--name">
                {user.first_name} {user.last_name}
              </h5>
              <p className="user-info__titles--position">Admin</p>
            </div>
            <div className="img-cont">
              <img
                src={accountIcon}
                className="user-info__icon"
                alt="person outline account icon"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
