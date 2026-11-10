import express from "express";
import cors from "cors";
import session from "express-session";

import { env } from "./config/env.js";
import { MySQLSessionStore } from "./config/sessionStore.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { HttpError } from "./middlewares/httpError.js";

const app = express();

// Railway/Render están detrás de un proxy HTTPS: necesario para cookies "secure"
if (env.isProduction) app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      // Sin Origin = peticiones directas (curl, healthchecks)
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      callback(new HttpError(403, "Origen no permitido por CORS."));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    // En memoria solo en desarrollo; en producción, en MySQL
    store: env.isProduction ? new MySQLSessionStore() : undefined,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // Frontend y API en dominios distintos => SameSite=None + Secure
      secure: env.isProduction,
      sameSite: env.isProduction ? "none" : "lax",
    },
  })
);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
