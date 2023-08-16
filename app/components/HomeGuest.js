import React, { useEffect, useContext } from "react";
import Page from "./Page";
import axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import DispatchContext from "../DispatchContext";

const HomeGuest = () => {
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    username: {
      value: "",
      hasError: false,
      errorMessage: "",
      isUnique: false,
      checkCounters: 0,
    },
    email: {
      value: "",
      hasError: false,
      errorMessage: "",
      isUnique: false,
      checkCounters: 0,
    },
    password: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
    submitCount: 0,
  };

  const reducer = (draft, action) => {
    switch (action.type) {
      case "usernameImmediate":
        draft.username.hasError = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Username can't be longer than 30 characters";
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Username can only contain letters, numbers";
        }
        break;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Username must be at least 3 characters";
        }
        if (!draft.username.hasError && !action.noRequest) {
          draft.username.checkCounters++;
        }
        break;
      case "usernameUnique":
        if (action.value) {
          draft.username.hasError = true;
          draft.username.isUnique = false;
          draft.username.errorMessage = "Username already exists";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailImmediate":
        draft.email.hasError = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasError = true;
          draft.email.errorMessage = "Invalid email address";
        }
        if (!draft.email.hasError && !action.noRequest) {
          draft.email.checkCounters++;
        }
        break;
      case "emailUnique":
        if (action.value) {
          draft.email.hasError = true;
          draft.email.isUnique = false;
          draft.email.errorMessage = "Email already exists";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "passwordImmediate":
        draft.password.hasError = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasError = true;
          draft.password.errorMessage = "Password can't be longer than 50 characters";
        }
        break;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasError = true;
          draft.password.errorMessage = "Password must be at least 12 characters";
        }
        break;
      case "submitForm":
        if (!draft.username.hasError && draft.username.isUnique && !draft.password.hasError && !draft.email.hasError && draft.email.isUnique) {
          draft.submitCount++;
        }
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.username.checkCounters) {
      async function fetchResults() {
        await axios
          .post("/doesUsernameExist", { username: state.username.value })
          .then((res) => dispatch({ type: "usernameUnique", value: res.data }))
          .catch((e) => console.log(e));
      }
      fetchResults();
    }
  }, [state.username.checkCounters]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.email.checkCounters) {
      async function fetchResults() {
        await axios
          .post("/doesEmailExist", { email: state.email.value })
          .then((res) => dispatch({ type: "emailUnique", value: res.data }))
          .catch((e) => console.log(e));
      }
      fetchResults();
    }
  }, [state.email.checkCounters]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "usernameImmediate", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true });
    dispatch({ type: "emailImmediate", value: state.email.value });
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true });
    dispatch({ type: "passwordImmediate", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({type: "submitForm"})
  }

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        await axios
          .post("/register", { username: state.username.value, email: state.email.value, password: state.password.value })
          .then((res) => {
            appDispatch({ type: "login", data: res.data });
            appDispatch({ type: "flashMessage", value: "Registration Successful" });
          })
          .catch((e) => console.log(e));
      }
      fetchResults();
    }
  }, [state.submitCount]);

  return (
    <>
      <Page title="Welcome !" wide={true}>
        <div className="row align-items-center">
          <div className="col-lg-7 py-3 py-md-5">
            <h1 className="display-3">Remember Writing?</h1>
            <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
          </div>
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label htmlFor="username-register" className="text-muted mb-1">
                  <small>Username</small>
                </label>
                <input onChange={(e) => dispatch({ type: "usernameImmediate", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
                <CSSTransition in={state.username.hasError} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.username.errorMessage}</div>
                </CSSTransition>
              </div>
              <div className="form-group">
                <label htmlFor="email-register" className="text-muted mb-1">
                  <small>Email</small>
                </label>
                <input onChange={(e) => dispatch({ type: "emailImmediate", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
                <CSSTransition in={state.email.hasError} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.email.errorMessage}</div>
                </CSSTransition>
              </div>
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <small>Password</small>
                </label>
                <input onChange={(e) => dispatch({ type: "passwordImmediate", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
                <CSSTransition in={state.password.hasError} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.password.errorMessage}</div>
                </CSSTransition>
              </div>
              <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                Sign up for ComplexApp
              </button>
            </form>
          </div>
        </div>
      </Page>
    </>
  );
};

export default HomeGuest;
