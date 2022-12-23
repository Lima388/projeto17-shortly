import { signUpSchema } from "../models/signUp.model.js";
import { connection } from "../database/db.js";

export async function signUpValidation(req, res, next) {
  const user = req.body;
  const { error } = signUpSchema.validate(user, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  try {
    const userExists = await connection.query(
      "SELECT COUNT(email) FROM users WHERE email = $1",
      [user.email]
    );
    console.log(userExists.rows[0].count);
    if (userExists.rows[0].count > 0) {
      return res.status(409).send({ message: "Esse usuário já existe" });
    }

    if (user.password != user.confirmPassword) {
      return res.status(400).send({ message: "Confirmação de senha falhou" });
    }

    next();
  } catch (err) {
    return res.status(500).send(err);
  }
}
