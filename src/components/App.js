import React from "react";
import { Route, useNavigate, Routes } from "react-router-dom";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeleteCardPopup from "./DeleteCardPopup.js";
import Login from "./Login.js";
import Register from "./Register.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api.js";
import * as auth from "../utils/Auth.js";
import ProtectedRouteElement from "./ProtectedRoute.js";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] =
    React.useState(false);
  const [cardWithConfirm, setCardWithConfirm] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  //const [isLoading, setIsLoading] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      auth
        .getContent(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log("401 — Переданный токен некорректен");
          }
          console.log("400 - пользователь с email не найден");
        });
    }
  }, [navigate]);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleCardDeleteConfirm(card) {
    setIsDeleteCardPopupOpen(true);
    setCardWithConfirm(card);
  }
  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard();
  }

  function handlePopupCloseClick(evt) {
    if (evt.target.classList.contains("popup_opened")) {
      closeAllPopups();
    }
  }

  React.useEffect(() => {
    if (
      isEditAvatarPopupOpen ||
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isDeleteCardPopupOpen ||
      isInfoTooltipPopupOpen ||
      selectedCard
    ) {
      function handleEsc(evt) {
        if (evt.key === "Escape") {
          closeAllPopups();
        }
      }
      document.addEventListener("keydown", handleEsc);

      return () => {
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isDeleteCardPopupOpen,
    isInfoTooltipPopupOpen,
    selectedCard,
  ]);

  function handleUpdateUser(user) {
    api
      .patchUserInfo(user)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleAvatarUpdate(avatar) {
    api
      .patchUserAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (!isLiked) {
      api
        .addLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function handleAddPlaceSubmit(data) {
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id && c));
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleRegisterSubmit(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        setIsInfoTooltipPopupOpen(true);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - пользователь с email не найден");
        }
        setIsInfoTooltipPopupOpen(true);
      });
  }

  function handleLoginsubmit(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        setEmail(true);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - пользователь с email не найден");
        }
      });
  }

  function handleSignOutSubmit() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    navigate("/sign-in");
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          email={email}
          onSignOut={handleSignOutSubmit}
          loggedIn={loggedIn}
        />
        <Routes>
        <Route
            path="/sign-up"
            element={
              <Register
                onRegister={handleRegisterSubmit}
                onSignOut={setIsInfoTooltipPopupOpen}
              />
            }
          ></Route>
          <Route
            path="/sign-in"
            element={<Login onLogin={handleLoginsubmit} />}
          ></Route>
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                component={Main}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDeleteConfirm}
              />
            }
          />
        </Routes>
        {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
        />

        <DeleteCardPopup
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onDeleteCardConfirm={handleCardDelete}
          cardId={cardWithConfirm}
        ></DeleteCardPopup>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onUpdateAvatar={handleAvatarUpdate}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
