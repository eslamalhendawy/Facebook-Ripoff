import React, { useState, useContext } from "react";
import Page from "./Page";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/create-post", { title, body, token: appState.user.token });
      appDispatch({ type: "flashMessage", value: "Post Created Successfully !" });
      //Redirect To New Post URL
      navigate(`/post/${response.data}`);
      console.log("New Post Created");
      setTitle("");
      setBody("");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}

export default CreatePost;
