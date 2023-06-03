import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onRegister(email, password);
  }

  return (
    <>
      <section className="auth">
        <h2 className="auth__title">Регистрация</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
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
          <div className="auth__sing-up">
            <p className="auth__sing-up_title">
              Уже зарегистрировались?
              <Link className="auth__sing-up_link" to="/sing-in">
                Войти
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
