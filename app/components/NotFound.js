import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Post Not Found</h2>
        <p className="lead text-muted">
          Return To <Link to="/">Homepage</Link> And Try Again
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
