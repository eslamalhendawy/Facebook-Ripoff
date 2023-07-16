import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ViewSinglePost() {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const { id } = useParams();

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

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
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
