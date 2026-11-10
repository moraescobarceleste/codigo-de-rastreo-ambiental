import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`API Rastreo Ambiental ejecutándose en http://localhost:${env.port}`);
});
