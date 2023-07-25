import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import Header from "../Header.js";


const AuthorsIndex = () => {
  const authors = useLoaderData() ?? [];
  return (
    <div>
      <Header />
      <div>
        {authors.map((author) => (
          <div key={author.id}>
            <p>
              <Link to={`/author/${author.id}`}>{author.name}</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorsIndex;
