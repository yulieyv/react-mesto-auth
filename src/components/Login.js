import React from "react";

function Login(props) {
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
    props.onLogin(email, password);
  }

  return (
    <>
      <section className="auth">
        <h2 className="auth__title">Вход</h2>
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
            Войти
          </button>
        </form>
      </section>
    </>
  );
}

export default Login;
