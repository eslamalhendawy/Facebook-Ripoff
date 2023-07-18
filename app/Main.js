import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

//Contexts
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
//Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";
import About from "./components/About";
import Home from "./components/Home";
import ViewSinglePost from "./components/ViewSinglePost";
import CreatePost from "./components/CreatePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        break;
      case "logout":
        draft.loggedIn = false;
        break;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
    }
  }, [state.loggedIn]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route path="/" exact element={state.loggedIn ? <Home /> : <HomeGuest />} />
            <Route path="/terms" exact element={<Terms />} />
            <Route path="/about" exact element={<About />} />
            <Route path="/create-post" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" exact element={<EditPost />} />
            <Route path="/profile/:username" exact element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
