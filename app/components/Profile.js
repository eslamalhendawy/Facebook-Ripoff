import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StateContext from "../StateContext";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "http://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: {
      postCount: "",
      followerCount: "",
      followingCount: ""
    }
  });

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchData() {
      await axios
        .post(`profile/${username}`, { token: appState.user.token }, {cancelToken: request.token})
        .then((res) => setProfileData(res.data))
        .catch((e) => console.log(e));
    }
    fetchData();
    return () => {
      request.cancel();
    }
  }, []);

  return (
    <Page title="Profile Page">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
}

export default Profile;
