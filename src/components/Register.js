import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [email, setEmail] = React.useState("");
  const [password, setFormPassword] = React.useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setFormPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onRegister(password, email);
  }

  return (
    <>
      <section className="auth">
        <form className="auth__form" onSubmit={handleSubmit}>
          <h2 className="auth__title">Регистрация</h2>
          <input
            className="auth__input"
            onChange={handleEmailChange}
            placeholder="Email"
            name="email"
            type="email"
            value={email || ""}
            required
            autoComplete="off"
          ></input>
          <input
            className="auth__input"
            onChange={handlePasswordChange}
            placeholder="Пароль"
            name="password"
            type="password"
            value={password || ""}
            required
            autoComplete="off"
          ></input>
          <button className="auth__submit-button" type="submit">
            Зарегистрироваться
          </button>
          <div className="auth__sign-up">
            <p className="auth__sign-up_title">
              Уже зарегистрировались?
              <Link className="auth__sign-up_link" to="/sign-in">
                &nbsp; Войти
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
