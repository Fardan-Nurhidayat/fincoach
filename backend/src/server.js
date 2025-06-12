import Hapi from "@hapi/hapi";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expensesRoutes from "./routes/expensesRoutes.js";
import savingsRoutes from "./routes/savingsRoutes.js";
import investmentsRoutes from "./routes/investmentsRoutes.js";
import riskProfileRoutes from "./routes/riskProfileRoutes.js";

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
      },
    },
  });

  await server.register([
    {
      plugin: userRoutes,
      options: {},
      routes: { prefix: "/api" },
    },
    {
      plugin: authRoutes,
      options: {},
      routes: { prefix: "/api" },
    },
    {
      plugin: incomeRoutes,
      options: {},
      routes: { prefix: "/api" },
    },
    {
      plugin: expensesRoutes,
      options: {},
      routes: { prefix: "/api" },
    },
    {
      plugin: savingsRoutes,
      options: {},
      routes: { prefix: "/api" },
    },
    {
      plugin: investmentsRoutes,
      options: {},
      routes: { prefix: "/api" },
    },
    {
      plugin: riskProfileRoutes,
      options: {},
      routes: { prefix: "/api" },
    },
  ]);

  await server.start();
  console.log("Server running at", server.info.uri);
};

init();
