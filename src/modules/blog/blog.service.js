import {dbConnection} from "../../db/db.connection.js";



export const addBlog = (req, res, next) => {
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
}

export const deleteBlog = (req, res, next) => {
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
}

export const updateBlog = (req, res, next) => {
  let { id } = req.params;
  let { content, title } = req.body;
  let q = "update blogs set content = ? , title = ? where id = ?";
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
}