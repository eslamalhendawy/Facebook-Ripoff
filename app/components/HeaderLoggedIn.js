import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    appDispatch({ type: "logout" });
    navigate("/");
  };

  const showSearch = (e) => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a onClick={showSearch} href="#" className="text-white mr-2 header-search-icon" data-tooltip-place="bottom" data-tooltip-content="Search" data-tooltip-id="search">
        <i className="fas fa-search"></i>
      </a>
      <Tooltip id="search" />{" "}
      <span className="mr-2 header-chat-icon text-white" data-tooltip-place="bottom" data-tooltip-content="Chat" data-tooltip-id="chat">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Tooltip id="chat" />{" "}
      <Link to={`/profile/${appState.user.username}`} className="mr-2" data-tooltip-place="bottom" data-tooltip-content="Profile" data-tooltip-id="profile">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <Tooltip id="profile" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button className="btn btn-sm btn-secondary" onClick={handleLogOut}>
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
