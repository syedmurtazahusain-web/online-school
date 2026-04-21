const jwt = require("jsonwebtoken");

const SECRET = "mysupersecretkey";

function decodeToken(token) {
  try {
    return jwt.verify(token.replace("Bearer ", ""), SECRET);
  } catch (err) {
    return null;
  }
}

export default { decodeToken, SECRET };