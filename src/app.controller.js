import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.contoller.js";
import blogRouter from "./modules/blog/blog.controller.js"; 

const bootStrap = (express, app) => {
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/blog", blogRouter);

  
  app.get("/", (req, res) => {
    res.send("Welcome to the Blog App API");
  });
};

export default bootStrap;