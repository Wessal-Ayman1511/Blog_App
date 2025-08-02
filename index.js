const express = require("express");
const sql = require("mysql2");
const port = 3000;
const app = express();
app.use(express.json());
const dbConnection = sql.createConnection({
  host: "127.0.0.1",
  user: "root",
  passwrod: "",
  database: "blog_app",
});

dbConnection.connect((error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log("DB Connected Successfully");
  }
});

app.post("/register", (req, res, next) => {
  let { fname, lname, email, password, dof } = req.body;

  dbConnection.execute(
    `select * from users where email = ?`,
    [email],
    (error, result) => {
      if (error) {
        return res.status(500).json({ msg: error.message });
      } else {
        if (result.length > 0) {
          return res.json({ msg: "user already exist" });
        }
        dbConnection.execute(
          `insert into users (fname, lname, email, password, dof) 
                values(?, ?, ?, ?, ?)`,
          [fname, lname, email, password, dof],
          (error, result) => {
            if (error) {
              return res.status(500).json({ msg: error.message });
            } else {
              if (result.affectedRows > 0) {
                return res.status(200).json({ msg: "user added successfully" });
              } else {
                return res.json({ msg: "something wrong" });
              }
            }
          }
        );
      }
    }
  );
});

app.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  console.log(email, password);
  dbConnection.execute(
    `select * from users where email = ?`,
    [email],
    (error, result) => {
      if (error) {
        return res.status(500).send({ msg: "internal server error" });
      } else {
        if (result.length == 0 || result[0].password != password) {
          return res.status(401).json({ msg: "invalid credintials" });
        } else {
          return res
            .status(200)
            .json({ msg: "login successfully", id: result[0].id });
        }
      }
    }
  );
});

app.get("/users", (req, res, next) => {
  dbConnection.execute("select * from users", (error, result) => {
    if (error) {
      return res.status(500).json({ msg: "internal server error" });
    }
    if (result.length == 0) {
      return res.json({ msg: "No users" });
    }
    return res.status(200).json({ users: result });
  });
});

app.post("/add-blog", (req, res, next) => {
  let { title, content, u_id } = req.body;

  dbConnection.execute(
    "insert into blogs(title, content, u_id) values(?, ?, ?)",
    [title, content, u_id],
    (error, result) => {
      if (error) {
        return res.status(500).json({ msg: "internal server error" });
      } else {
        if (result.affectedRows == 0) {
          return res.status(500).json({ msg: "Cannot add blog" });
        } else {
          return res.status(201).json({ msg: "blog added successfully" });
        }
      }
    }
  );
});

app.delete("/delete-blog/:id", (req, res, next) => {
  let { id } = req.params;

  dbConnection.execute(
    "update blogs set is_deleted = 1 where id = ? and is_deleted = 0",
    [id],
    (error, result) => {
      if (error) {
        return res.status(500).json({ msg: error.message });
      } else {
        if (result.affectedRows == 0) {
          return res.status(404).json({ msg: "not found" });
        }
        return res.status(200).json({ msg: "blog deleted successfully" });
      }
    }
  );
});

app.get("/profile/:id", (req, res, next) => {
  let { id } = req.params;
  q = `select u.id as userId,
    concat(fname, ' ', lname) as name,
    floor(DATEDIFF(now(), dof) / 365) as age,
    email,
    password,
    b.id as blogId,
    title,
    content,
    is_deleted
    from users as u left join blogs as b
    on u.id = b.u_id
    where u.id = ?`;
  dbConnection.execute(q, [id], (error, result) => {
    if (error) {
      return res.status(500).json({ msg: error.msg });
    } else {
      console.log(result);
      if (result.length == 0 || !result[0].userId) {
        return res.status(404).json({ msg: "User not found" });
      } else {
        let user = result[0];
        let userInfo = {
          Name: user.name,
          Age: user.Age,
          E_mail: user.email,
          password: user.password,
          blogs: [],
        };

        result.forEach((row) => {
          if (row.blogId && !row.is_deleted) {
            userInfo["blogs"].push({
              Title: row.title,
              Content: row.content,
            });
          }
        });
        return res.status(200).json({ userInfo });
      }
    }
  });
});

app.put("/update-blog/:id", (req, res, next) => {
  let { id } = req.params;
  let { content, title } = req.body;
  q = "update blogs set content = ? , title = ? where id = ?";
  dbConnection.execute(q, [content, title, id], (error, result) => {
    if (error) {
      return res.status(500).json({ msg: error.message });
    }
    {
      if (result.affectedRows == 0) {
        return res.status(500).json({ msg: error.message });
      }
      dbConnection.execute(
        "select * from blogs where id = ?",
        [id],
        (error, result) => {
          if (error) {
            return res.status(500).json({ msg: error.message });
          }
          return res
            .status(200)
            .json({ msg: "Blog Updated Seccessully", updatedData: result[0] });
        }
      );
    }
  });
});
app.listen(port, () => {
  console.log("app is running of port", port);
});
