import { connection } from "../database/db.js";

export async function findOrdered(req, res) {
  try {
    const { rows: userRows } = await connection.query(
      "SELECT id, name FROM users"
    );

    for (let i = 0; i < userRows.length; i++) {
      const user = userRows[i];
      const { rows: urlRows } = await connection.query(
        "SELECT * FROM urls WHERE (userid) = $1;",
        [user.id]
      );
      let visitTotal = 0;
      for (let i = 0; i < urlRows.length; i++) {
        visitTotal += urlRows[i].views;
      }
      userRows[i].linksCount = urlRows.length;
      userRows[i].visitCount = visitTotal;
    }

    const sorted = userRows.sort(compare);
    res.status(200).send(sorted);
  } catch (err) {
    res.sendStatus(500);
  }
}

function compare(a, b) {
  if (a.visitCount < b.visitCount) {
    return 1;
  }
  if (a.visitCount > b.visitCount) {
    return -1;
  }
  return 0;
}
