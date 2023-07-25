import mongoose from "mongoose";
import { toJSONPlugin } from "./plugins/index.js";

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        const stringifiedYear = value.toString();
        return stringifiedYear.length <= 4;
      },
      message: (props) => `${props.value} is not a valid year`
    },
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "Author",
    required: true
  },
});

toJSONPlugin(BookSchema);

export default mongoose.model('Book', BookSchema);
