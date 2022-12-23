import { connection } from "../database/db.js";
import bcrypt from "bcrypt";
import { signInSchema } from "../models/signIn.model.js";

export async function signInValidation(req, res, next) {
  const user = req.body;

  const { error } = signInSchema.validate(user, { abortEarly: false });
  try {
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    let { rows: userExists } = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [user.email]
    );
    userExists = userExists[0];
    if (!userExists) {
      return res.sendStatus(401);
    }
    console.log(userExists);
    const passwordOk = bcrypt.compareSync(user.password, userExists.password);
    if (!passwordOk) {
      return res.sendStatus(401);
    }

    req.user = userExists;

    next();
  } catch (err) {
    return res.sendStatus(500);
  }
}
