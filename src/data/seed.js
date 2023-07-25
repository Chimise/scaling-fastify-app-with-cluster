import mongoose from "mongoose";
import Author from "../backend/models/Author.js";
import Book from "../backend/models/Book.js";
import { authors } from "./authors.js";

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/library");
    await Book.deleteMany({});
    await Author.deleteMany({});
    for (const authorData of authors) {
      const { books, bio, name } = authorData;
      const author = await Author.create({ bio, name });
      console.log(author);
      const filteredBooks = books.map(({ id, ...data }) => ({
        ...data,
        author: author._id.toString(),
      }));
      const savedBooks = await Book.insertMany(filteredBooks);
      console.log(savedBooks);
    }
  } catch (error) {
  } finally {
    await mongoose.connection.close();
  }
}

main().catch((err) => console.log(err));
