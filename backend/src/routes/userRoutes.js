import * as UserController from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const routes = [
  {
    method: "GET",
    path: "/users",
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: UserController.getUsers,
  },
  {
    method: "POST",
    path: "/users",
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: UserController.createUser,
  },
  {
    method: "PUT",
    path: "/users/{id}",
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: UserController.updateUser,
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: UserController.deleteUser,
  },
  {
    method: "GET",
    path: "/users/profile",
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: UserController.getUserByUid,
  },
];

export default {
  name: "userRoutes",
  register: async function (server) {
    server.route(routes);
  },
};
