import React from "react";
import { useLoaderData } from "react-router-dom";
import NotFoundPage from "./404.js";
import Header from "../Header.js";

const AuthorPage = () => {
  const author = useLoaderData();

  if (!author) {
    return <NotFoundPage error="Author not found" />;
  }

  return <div>
    <Header />
    <h2>{author.name}</h2>
    <p>{author.bio}</p>
    <ul>
      {author.books.map(book => (<li key={book.id}>{book.title} ({book.year})</li>))}
    </ul>
  </div>;
};

export default AuthorPage;

