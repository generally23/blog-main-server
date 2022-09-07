const mongoose = ({ Schema } = require("mongoose"));

const likeSchema = new Schema({
  _id: {
    type: String,
    default: function () {
      return this.liked + this.liker;
    },
  },
  liked: {
    type: Schema.Types.ObjectId,
    required: [true, "Field { liked } is required"],
  },
  liker: {
    type: Schema.Types.ObjectId,
    required: [true, "Field { liked } is required"],
  },
});

likeSchema.index("_id");

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
