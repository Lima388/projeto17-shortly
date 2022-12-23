import { connection } from "../database/db.js";
import { nanoid } from "nanoid";

export async function create(req, res) {
  const { url } = req.body;
  const user = req.user;
  let idExists;
  let shortUrl;
  try {
    do {
      shortUrl = nanoid(8);
      const { rows } = await connection.query(
        "SELECT * FROM urls WHERE shorturl = $1;",
        [shortUrl]
      );
      idExists = rows.length > 0;
    } while (idExists);

    await connection.query(
      "INSERT INTO urls (userid, fullurl, shorturl, views) VALUES ($1, $2, $3, $4);",
      [user.id, url, shortUrl, 0]
    );

    res.status(201).send({ shortUrl: shortUrl });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function findAndGo(req, res) {
  const shortUrl = req.params.shortUrl;
  try {
    const { rows: urlRows } = await connection.query(
      "SELECT * FROM urls WHERE shorturl = $1",
      [shortUrl]
    );
    if (urlRows.length === 0) {
      return res.sendStatus(404);
    }
    const urlObj = urlRows[0];
    await connection.query("UPDATE urls SET views=$1 WHERE id=$2;", [
      urlObj.views + 1,
      urlObj.id,
    ]);
    res.redirect(urlObj.fullurl);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function remove(req, res) {
  const id = req.params.id;
  const user = req.user;

  try {
    const { rows: urlRows } = await connection.query(
      "SELECT * FROM urls WHERE id = $1",
      [id]
    );

    if (urlRows.length === 0) {
      return res.sendStatus(404);
    }

    const urlObj = urlRows[0];

    if (urlObj.userid !== user.id) {
      return res.sendStatus(401);
    }

    await connection.query("DELETE FROM urls WHERE id=$1", [id]);

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
export async function findOne(req, res) {
  const id = req.params.id;
  try {
    const { rows: urlRows } = await connection.query(
      "SELECT * FROM urls WHERE id = $1",
      [id]
    );

    if (urlRows.length === 0) {
      return res.sendStatus(404);
    }

    const urlObj = {
      id: urlRows[0].id,
      shortUrl: urlRows[0].shorturl,
      url: urlRows[0].fullurl,
    };

    res.status(200).send(urlObj);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
