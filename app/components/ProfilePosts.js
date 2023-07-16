import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    async function getPosts() {
      await axios
        .get(`profile/${username}/posts`)
        .then((res) => {
            console.log(res.data);
          setPosts(res.data);
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    }
    getPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate);
        const formatedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        return (
          <Link to={`/post/${post._id}`} className="list-group-item list-group-item-action" key={post._id}>
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
            <span className="text-muted small"> on {formatedDate}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
