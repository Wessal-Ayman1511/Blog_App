import {dbConnection} from "../../db/db.connection.js";

export const getUsers = (req, res, next) => {
  dbConnection.execute("select * from users", (error, result) => {
    if (error) {
      return res.status(500).json({ msg: "internal server error" });
    }
    if (result.length == 0) {
      return res.json({ msg: "No users" });
    }
    return res.status(200).json({ users: result });
  });
}

export const getProfile = (req, res, next) => {
  let { id } = req.params;
  let q = `select u.id as userId,
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
}