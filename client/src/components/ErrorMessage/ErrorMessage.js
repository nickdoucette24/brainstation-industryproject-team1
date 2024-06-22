import errorIcon from "../../assets/icons/error-24px.svg";
import "./ErrorMessage.scss";

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <img className="error-icon" src={errorIcon} alt="error icon" />
      <p className="p3">{message}</p>
    </div>
  );
};

export default ErrorMessage;
