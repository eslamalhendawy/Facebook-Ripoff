import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Tooltip } from "react-tooltip";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function ViewSinglePost() {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const { id } = useParams();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function getPost() {
      await axios
        .get(`post/${id}`, { cancelToken: request.token })
        .then((res) => {
          setPost(res.data);
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    }
    getPost();
    return () => {
      request.cancel();
    };
  }, []);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  };

  async function deleteHandler() {
    const areYouSure = window.confirm("Do You Really Want To Delete This Post ?");
    if (areYouSure) {
      await axios
        .delete(`/post/${id}`, { data: { token: appState.user.token } })
        .then((res) => {
          if (res.data == "Success") {
            appDispatch({ type: "flashMessage", value: "Post Successfully Deleted" });
            navigate(`/profile/${appState.user.username}`);
          }
        })
        .catch();
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tooltip-content="Edit" data-tooltip-id="edit" data-tooltip-place="top" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <Tooltip id="edit" />{" "}
            <a onClick={deleteHandler} data-tooltip-content="Delete" data-tooltip-id="delete" data-tooltip-place="top" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <Tooltip id="delete" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formatedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
    </Page>
  );
}

export default ViewSinglePost;
