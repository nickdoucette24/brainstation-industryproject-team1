import RegisterForm from "../../components/RegisterForm/RegisterForm";
import LoginForm from "../../components/LoginForm/LoginForm";
import spectraLogo from "../../assets/images/logos/dell-spectra-logo-dark.svg";
import "./AuthPage.scss";

export const AuthPage = () => {
  return (
    <div className="auth-page">
      <div className="droplet-1"></div>
      <div className="droplet-2"></div>
      <div className="droplet-3"></div>
      <div className="droplet-4"></div>
      <div className="droplet-5"></div>
      <div className="droplet-6"></div>
      <div className="droplet-7"></div>
      <div className="droplet-8"></div>
      <div className="droplet-9"></div>
      <div className="login-wrapper">
        <div className="login-form__wrapper">
          <h1 className="login-form__heading">Sign In</h1>
          <div className="login-form__container">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="register-wrapper">
        <div className="register-container">
          <div className="logo-container">
            <img src={spectraLogo} alt="dell spectra brand logo" />
          </div>
          <div className="auth-form">
            <h1 className="auth-form__heading">Create an account</h1>
            <div className="auth-form__container">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
