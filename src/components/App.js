import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "../App.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup";
import Register from "./Register";
import Login from "./Login";
import ProtctedRoute from "./ProtectedRoute";

export default function App() {
  const [currentUser, setCurrentUser] = React.useState({});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [deletedCard, setDeletedCard] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [buttonText, setButtonText] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cards]) => {
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch((error) => console.log(`Ошибка: ${error}`));
  }, []);

  function handleEditAvatarClick() {
    setButtonText("Сохранить");
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setButtonText("Сохранить");
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setButtonText("Создать");
    setIsAddPlacePopupOpen(true);
  }

  function handleCardDelete(currentCard) {
    setButtonText("Да");
    setDeletedCard(currentCard);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setDeletedCard(null);
    setSelectedCard(null);
  }

  function handleCardLike(currentCard, isLiked) {
    api
      .changeLikeCardStatus(currentCard._id, isLiked)
      .then((newCard) => {
        setCards(
          cards.map((card) => (card._id === currentCard._id ? newCard : card))
        );
      })
      .catch((error) => console.log(`Ошибка: ${error}`));
  }

  function handleConfirmCardDelete() {
    setButtonText("Удаление...");
    api
      .deleteCard(deletedCard._id)
      .then(() => {
        setCards(cards.filter((card) => card._id !== deletedCard._id));
        closeAllPopups();
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setButtonText("Да"));
  }

  function handleUpdateProfile(data) {
    setButtonText("Сохранение...");
    api
      .patchProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setButtonText("Сохранить"));
  }

  function handleUpdateAvatar(data) {
    setButtonText("Сохранение...");
    api
      .patchAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setButtonText("Сохранить"));
  }

  function handleAddPlace(data) {
    setButtonText("Создание...");
    api
      .postCard(data)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setButtonText("Создать"));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <ProtctedRoute isLoggedIn={isLoggedIn}>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
              </ProtctedRoute>
            }
          />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
        </Routes>

        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateProfile={handleUpdateProfile}
          buttonText={buttonText}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
          buttonText={buttonText}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          buttonText={buttonText}
        />
        <ConfirmPopup
          isOpen={deletedCard}
          onClose={closeAllPopups}
          onConfirm={handleConfirmCardDelete}
          buttonText={buttonText}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}
