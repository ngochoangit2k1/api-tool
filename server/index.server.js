import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

function base64UrlDecode(str) {
  if (!str) {
    return "";
  }
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Buffer.from(base64, "base64");
  return buffer.toString("utf-8");
}

export default async function data(req, res, next) {
  try {
    // const apiUrl = "https://api-v3.baontq.xyz/v3/auth/login";
    // const apiUrl2 = "https://api-v3.baontq.xyz/v3/package/undefined/asc?q=";
    const loginData = {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    };
    console.log(process.env.APIURL)
    const response = await axios.post(process.env.APIURL, loginData);
    console.log( "response",response);

    const token = response.data;
    const tokenParts = token.split(".");
    const payload = JSON.parse(base64UrlDecode(tokenParts[1]));

    const isExpired = Date.now() >= payload.exp * 1000;

    if (isExpired) {
      return res.status(401).send("Token hết hạn");
    }

    const accessToken = token;
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    };

    const response2 = await axios.get(process.env.TOKENURL, { headers });
    const newToken = response2.data.data[0].token;
    console.log(newToken);
    return res.status(200).send(newToken);
  } catch (error) {
    console.error("Lỗi:", error.message);
    return res.status(500).send("Có lỗi xảy ra");
  }
}

