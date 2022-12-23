import { connection } from "../database/db.js";
export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const { rows: sessionRows } = await connection.query(
      "SELECT * FROM sessions WHERE (token) = $1;",
      [token]
    );
    if (sessionRows.length === 0) {
      return res.sendStatus(401);
    }

    const { rows: userRows } = await connection.query(
      "SELECT * FROM users WHERE (id) = $1;",
      [sessionRows[0].userid]
    );
    console.log(sessionRows[0]);
    console.log(userRows[0]);
    if (!userRows[0]) {
      return res.sendStatus(401);
    }

    req.user = userRows[0];
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }

  next();
}
