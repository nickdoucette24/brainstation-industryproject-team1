import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./LoginForm.scss";

const LoginForm = () => {
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    let formErrors = {};
    if (!formValues.email) formErrors.email = "Email is required.";
    if (!formValues.password) formErrors.password = "Password is required.";
    return formErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);
    setIsSubmitting(true);
  };

  useEffect(() => {
    const login = async () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        const loginPayload = {
          email: formValues.email,
          password: formValues.password,
        };

        try {
          const response = await axios.post(
            process.env.REACT_APP_BASE_URL,
            loginPayload
          );

          if (response.data.success) {
            navigate("/dashboard");
          } else {
            setErrors({ form: "Invalid email or password." });
          }
        } catch (error) {
          setErrors({ form: "Internal Server Error" });
        }
      }
      setIsSubmitting(false);
    };

    login();
  }, [errors, isSubmitting, formValues, navigate]);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-fields">
        <label htmlFor="email" className="input-fields__label">
          Email
        </label>
        <input
          className="input-fields__input"
          type="email"
          name="email"
          placeholder="employee@dell.com"
          onChange={handleInput}
          value={formValues.email}
        />
        {errors.email && <ErrorMessage message={errors.email} />}

        <label htmlFor="password" className="input-fields__label">
          Password
        </label>
        <input
          className="input-fields__input"
          type="password"
          name="password"
          placeholder="**********"
          onChange={handleInput}
          value={formValues.password}
        />
        {errors.password && <ErrorMessage message={errors.password} />}
      </div>
      {errors.form && <ErrorMessage message={errors.form} />}

      <a
        className="forgot-password"
        href="https://www.dell.com/dci/idp/dwa/forgotpassword?response_type=id_token&client_id=228467e4-d9b6-4b04-8a11-45e1cc9f786d&redirect_uri=https://www.dell.com/identity/global/in/228467e4-d9b6-4b04-8a11-45e1cc9f786d&scope=openid&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256&tag=cid%3d7bb7b782-5a5d-4fc9-8256-b82ba7cb6003%2caid%3d7d51a773-0eca-42fb-9a89-b0510c6787ce&nonce=zhblrzcwyjpwe1dmjeeyeswd&state=aHR0cHM6Ly93d3cuZGVsbC5jb20vSWRlbnRpdHkvZ2xvYmFsL0luLzdiYjdiNzgyLTVhNWQtNGZjOS04MjU2LWI4MmJhN2NiNjAwMz9jPWNhJmw9ZW4mcj1jYSZzPWNvcnAmYWN0aW9uPXJlZ2lzdGVyJnJlZGlyZWN0VXJsPWh0dHBzOiUyRiUyRnd3dy5kZWxsLmNvbSUyRmVuLWNhJTNGX2dsJTNEMSo2dHV1OHYqX3VwKk1RLi4lMjZnY2xpZCUzRENqMEtDUWp3dmItekJoQ21BUklzQUFmVUkydGx1WWtUSVVwZk00amVEb0pLYUFMNDIydWxZVHl0bmw1TDQ5ZkpPbWJVSEZiSEFEZ3ZLT0FhQWwzQUVBTHdfd2NCJTI2Z2Nsc3JjJTNEYXcuZHM%3d"
      >
        Forgot Password?
      </a>
      <button className="login-button" type="submit">
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
