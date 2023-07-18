import React, { useEffect, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function EditPost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const originalState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };
  const Reducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        break;
      case "updateTitle":
        draft.title.value = action.value;
        draft.title.hasError = false;
        break;
      case "updateBody":
        draft.body.value = action.value;
        draft.body.hasError = false;
        break;
      case "submitRequest":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++;
        }
        break;
      case "updateRequestStarted":
        draft.isSaving = true;
        break;
      case "updateRequestFinished":
        draft.isSaving = false;
        break;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "Title Can't Be Blank";
        }
        break;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = "Body Can't Be Blank";
        }
        break;
      case "notFound":
        draft.notFound = true;
        break;
    }
  };
  const [state, dispatch] = useImmerReducer(Reducer, originalState);
  useEffect(() => {
    const request = axios.CancelToken.source();

    async function getPost() {
      await axios
        .get(`post/${state.id}`, { cancelToken: request.token })
        .then((res) => {
          if (res.data) {
            dispatch({ type: "fetchComplete", value: res.data });
            if(appState.user.username != res.data.author.username){
                appDispatch({type: "flashMessage", value: "You Don't Have Permission To Edit That Post"});
                navigate("/");
            }
          } else {
            dispatch({ type: "notFound" });
          }
        })
        .catch((e) => console.log(e));
    }
    getPost();
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "updateRequestStarted" });
      const request = axios.CancelToken.source();
      async function getPost() {
        await axios
          .post(`post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: request.token })
          .then((res) => {
            dispatch({ type: "updateRequestFinished" });
            appDispatch({ type: "flashMessage", value: "Post Updated Successfully" });
            navigate(`/post/${state.id}`);
          })
          .catch((e) => console.log(e));
      }
      getPost();
      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return (
      <NotFound />
    );
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  }
  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Return To Post
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "titleRules", value: e.target.value })} onChange={(e) => dispatch({ type: "updateTitle", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "bodyRules", value: e.target.value })} onChange={(e) => dispatch({ type: "updateBody", value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
