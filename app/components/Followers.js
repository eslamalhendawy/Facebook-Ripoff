import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

function Followers() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function getPosts() {
      await axios
        .get(`profile/${username}/followers`, { cancelToken: request.token })
        .then((res) => {
          setPosts(res.data);
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    }
    getPosts();
    return () => {
      request.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link to={`/profile/${follower.username}`} className="list-group-item list-group-item-action" key={index}>
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        );
      })}
    </div>
  );
}

export default Followers;
