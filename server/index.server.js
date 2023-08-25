const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const apiUrl = "https://api-v3.baontq.xyz/v3/auth/login";
const apiUrl2 = "https://api-v3.baontq.xyz/v3/package/undefined/asc?q=";

async function data(req, res, next) {
  try {
    const loginData = {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    };

    const response = await axios.post(apiUrl, loginData);
    const token = response.data;
    const tokenParts = token.split(".");
    const payload = JSON.parse(base64UrlDecode(tokenParts[1]));

    const isExpired = Date.now() >= payload.exp * 1000;

    if (isExpired) {
      return res.status(401).send("Token hết hạn");
    }

    const accessToken = token;
    const headers = {
      Authorization: `Bearer ${accessToken}`, 
    };

    const response2 = await axios.get(apiUrl2, { headers });
    const newToken = response2.data.data[0].token;

    return res.status(200).send(newToken);
  } catch (error) {
    console.error("Lỗi:", error.message);
    return res.status(500).send("Có lỗi xảy ra");
  }
}

function base64UrlDecode(str) {
  if (!str) {
    return "";
  }
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Buffer.from(base64, "base64");
  return buffer.toString("utf-8");
}

module.exports = data;
