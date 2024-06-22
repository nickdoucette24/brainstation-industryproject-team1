import errorIcon from "../../assets/icons/error-24px.svg";
import "./ErrorMessage.scss";

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <img className="error-message__icon" src={errorIcon} alt="error icon" />
      <p className="error-message__text">{message}</p>
    </div>
  );
};

export default ErrorMessage;
