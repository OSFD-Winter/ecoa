const PORT = process.env.PORT || 8080;

import express from "express";
import cors from "cors";

import loginRouter from "./routers/login-router.js";
import questionsRouter from "./routers/questions-router.js";
import surveysRouter from "./routers/surveys-router.js";
import prizesRouter from "./routers/prizes-router.js";
import answersRouter from "./routers/answers-router.js";
import finishRouter from "./routers/finish-router.js";
import progressRouter from "./routers/progress-router.js";

// TODO: future cors implementation when needing cross-domain request
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  "/game",

  /* 
    This is a hack to silence Unity warnings due to issues with gzip files and
    the way express handles compression  
  */

  express.static("../game/dist", {
    setHeaders: (res, path, _) => {
      if (path.includes(".gz")) {
        res.setHeader("Content-Encoding", "gzip");
      }

      if (path.includes(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
      }

      if (path.includes(".br")) {
        res.setHeader("Content-Encoding", "br");
      }
    },
  })
);
app.use("/api", loginRouter);
app.use("/api", questionsRouter);
app.use("/api", surveysRouter);
app.use("/api", prizesRouter);
app.use("/api", answersRouter);
app.use("/api", progressRouter);
app.use("/api", finishRouter);
app.use(express.static("../web/dist"));
app.use("*", (req, res) => {
  res.sendFile("index.html", { root: "../web/dist" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
