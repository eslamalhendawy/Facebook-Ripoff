import React, { useState, useContext } from "react";
import axios from "axios";
import DispatchContext from "../DispatchContext";

function HeaderLoggedOut() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const appDispatch = useContext(DispatchContext);
  async function submitHandler(e) {
    e.preventDefault();
    await axios
      .post("/login", { username, password })
      .then((response) => {
        if (response.data) {
          appDispatch({ type: "login", data: response.data });
          appDispatch({ type: "flashMessage", value: "Login Successful" });
          setUsername("");
          setPassword("");
        } else {
          console.log("Incorrect Username / Password");
          appDispatch({ type: "flashMessage", value: "Incorrect Username / Password" });
        }
      })
      .catch((e) => console.log(e));
  }
  return (
    <form onSubmit={submitHandler} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input value={username} onChange={(e) => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default HeaderLoggedOut;
