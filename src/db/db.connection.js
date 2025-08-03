
import { createConnection } from "mysql2";


export const dbConnection = createConnection({
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

