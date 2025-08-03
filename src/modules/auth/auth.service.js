import {dbConnection} from "../../db/db.connection.js";

export const register = (req, res, next) => {
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
};
export const login = (req, res, next) => {
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
}