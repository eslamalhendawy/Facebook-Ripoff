import React, { useEffect, useContext } from "react";
import { useParams, Route, Routes, NavLink } from "react-router-dom";
import axios from "axios";
import { useImmer } from "use-immer";
import StateContext from "../StateContext";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import Followers from "./Followers";
import Following from "./Following";

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingCount: 0,
    stopFollowingCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "http://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: {
        postCount: "",
        followerCount: "",
        followingCount: "",
      },
    },
  });

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchData() {
      await axios
        .post(`profile/${username}`, { token: appState.user.token }, { cancelToken: request.token })
        .then((res) =>
          setState((draft) => {
            draft.profileData = res.data;
          })
        )
        .catch((e) => console.log(e));
    }
    fetchData();
    return () => {
      request.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const request = axios.CancelToken.source();

      async function fetchData() {
        await axios
          .post(`addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: request.token })
          .then((res) =>
            setState((draft) => {
              draft.profileData.isFollowing = true;
              draft.profileData.counts.followerCount++;
              draft.followActionLoading = false;
            })
          )
          .catch((e) => console.log(e));
      }
      fetchData();
      return () => {
        request.cancel();
      };
    }
  }, [state.startFollowingCount]);

  useEffect(() => {
    if (state.stopFollowingCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const request = axios.CancelToken.source();

      async function fetchData() {
        await axios
          .post(`removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: request.token })
          .then((res) =>
            setState((draft) => {
              draft.profileData.isFollowing = false;
              draft.profileData.counts.followerCount--;
              draft.followActionLoading = false;
            })
          )
          .catch((e) => console.log(e));
      }
      fetchData();
      return () => {
        request.cancel();
      };
    }
  }, [state.stopFollowingCount]);

  const startFollowing = () => {
    setState((draft) => {
      draft.startFollowingCount++;
    });
  };

  const stopFollowing = () => {
    setState((draft) => {
      draft.stopFollowingCount++;
    });
  };

  return (
    <Page title="Profile Page">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
            Unfollow <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink exact to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink exact to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
        <Routes>
          <Route path="/" exact element={<ProfilePosts />} />
          <Route path="followers" exact element={<Followers />} />
          <Route path="following" exact element={<Following />} />
        </Routes>
    </Page>
  );
}

export default Profile;
