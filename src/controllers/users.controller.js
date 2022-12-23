import { connection } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function signUp(req, res) {
  const user = req.body;

  try {
    const hashPassword = bcrypt.hashSync(user.password, 10);
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3);",
      [user.name, user.email, hashPassword]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const user = req.user;
  const token = uuidV4();

  try {
    const { rows: sessionRows } = await connection.query(
      "SELECT * FROM sessions WHERE (userid) = $1;",
      [user.id]
    );
    if (sessionRows.length > 0) {
      await connection.query("DELETE FROM sessions WHERE userid=$1", [user.id]);
    }

    await connection.query(
      "INSERT INTO sessions (userid, token) VALUES ($1,$2)",
      [user.id, token]
    );

    const responseObj = {
      token: token,
      user: user.name,
    };

    res.send(responseObj);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function findAll(req, res) {
  const user = req.user;
  try {
    const { rows: urlRows } = await connection.query(
      "SELECT * FROM urls WHERE (userid) = $1;",
      [user.id]
    );
    const urlArray = [];
    let visitTotal = 0;
    for (let i = 0; i < urlRows.length; i++) {
      const url = urlRows[i];
      const obj = {
        id: url.id,
        shortUrl: url.shorturl,
        url: url.fullurl,
        visitCount: url.views,
      };
      visitTotal += url.views;
      urlArray.push(obj);
    }

    const responseObj = {
      id: user.id,
      name: user.name,
      visitCount: visitTotal,
      shortenedUrls: urlArray,
    };
    res.send(responseObj);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
