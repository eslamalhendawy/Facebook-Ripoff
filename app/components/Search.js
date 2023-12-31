import React, { useEffect, useContext } from "react";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext";
import axios from "axios";
import { Link } from "react-router-dom";

function Search() {
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  const hideSearch = () => {
    appDispatch({ type: "closeSearch" });
  };

  useEffect(() => {
    document.addEventListener("keyup", escapeHandler);
    return () => document.removeEventListener("keyup", escapeHandler);
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 750);
      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      async function fetchResults() {
        await axios
          .post("/search", { searchTerm: state.searchTerm })
          .then((res) =>
            setState((draft) => {
              draft.results = res.data;
              draft.show = "results";
            })
          )
          .catch((e) => console.log(e));
      }
      fetchResults();
    }
  }, [state.requestCount]);

  const escapeHandler = (e) => {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={hideSearch} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong>
                  {` (${state.results.length} ${state.results.length > 1 ? "items" : "item"} found)`}
                </div>
                {state.results.map((post) => {
                  const date = new Date(post.createdDate);
                  const formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                  return (
                    <Link onClick={() => appDispatch({ type: "closeSearch" })} to={`/post/${post._id}`} className="list-group-item list-group-item-action" key={post._id}>
                      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
                      <span className="text-muted small">
                        {" "}
                        by {post.author.username} on {formatedDate}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">No Results Found</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
