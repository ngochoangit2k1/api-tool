import { key } from "../server/key.server";

export default (req, res) => {
  return key(req, res);
};