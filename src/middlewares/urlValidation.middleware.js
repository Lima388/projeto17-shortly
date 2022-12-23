import { urlSchema } from "../models/url.model.js";
import { connection } from "../database/db.js";

export async function urlValidation(req, res, next) {
  const url = req.body;
  const { error } = urlSchema.validate(url, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  next();
}
