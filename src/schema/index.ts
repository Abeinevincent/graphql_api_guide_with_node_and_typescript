import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";
import UserType from "./User";
import MovieType from "./Movie";
import Movie from "../models/Movie";
import User from "../models/User";
import { hashPassword } from "../utils/passwordUtils";

// Queries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Query to get all users
    users: {
      type: GraphQLList(UserType),
      resolve: async () => {
        try {
          const users = await User.find();
          return users.map((user) => ({
            ...user.toObject(),
            id: user._id,
            createdAt: user.createdAt.toISOString(), // Format createdAt as ISO 8601
            updatedAt: user.updatedAt.toISOString(), // Format createdAt as ISO 8601
          }));
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Query to get a user by ID
    user: {
      type: UserType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args) => {
        try {
          const user = await User.findById(args.id);
          return {
            ...user.toObject(),
            id: user._id,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Query to get all movies
    movies: {
      type: GraphQLList(MovieType),
      resolve: async () => {
        try {
          return await Movie.find();
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Query to get a movie by ID
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args) => {
        try {
          return await Movie.findById(args.id);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Mutation to add a new user
    addUser: {
      type: UserType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        isAdmin: { type: GraphQLNonNull(GraphQLBoolean) },
      },

      resolve: async (_, args) => {
        try {
          // Destructure password
          const { password, ...others } = args;

          //   Send a hashed password
          const hashedPassword = await hashPassword(password);

          console.log(hashPassword);

          const user = new User({
            password: hashedPassword,
            ...others,
          });
          return await user.save();
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Mutation to update a user by ID
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        isAdmin: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          return await User.findByIdAndUpdate(args.id, args, { new: true });
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Mutation to delete a user by ID
    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args) => {
        try {
          return await User.findByIdAndDelete(args.id);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Mutation to add a new movie
    addMovie: {
      type: MovieType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLNonNull(GraphQLInt) },
        duration: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          const movie = new Movie(args);
          return await movie.save();
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Mutation to update a movie by ID
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLNonNull(GraphQLInt) },
        duration: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          return await Movie.findByIdAndUpdate(args.id, args, { new: true });
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },

    // Mutation to delete a movie by ID
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args) => {
        try {
          return await Movie.findByIdAndDelete(args.id);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
