import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

export const resolver = {
  createUser: async function ({ userInput }, req) {
    const email = userInput.email;
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User exists already");
      // TODO: More error handling in Graphql coming later
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    // createdUser._doc is the mongoose object without all the metadata
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};
