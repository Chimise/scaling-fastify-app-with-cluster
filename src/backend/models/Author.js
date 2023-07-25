import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins/index.js';

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true,
    }
})



AuthorSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'author'

})

toJSONPlugin(AuthorSchema);

export default mongoose.model('Author', AuthorSchema);

