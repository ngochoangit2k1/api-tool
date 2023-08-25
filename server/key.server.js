const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const apiUrl = "https://api-v3.baontq.xyz/v3/auth/login";
const apiUrl2 = "https://api-v3.baontq.xyz/v3/key/1136/1/10/id/desc";
const apiUrl3 = "https://api-v3.baontq.xyz/v3/key";

async function key(req, res) {
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
    const totalKeys = response2.data.meta.total;

    if (totalKeys > 9) {
      const keyIdToDelete = response2.data.data[9].id;
      const datax = {
        account_id: 1136,
        keyIds: [keyIdToDelete],
      };
      await axios.delete(apiUrl3, { data: datax, headers });
    } else {
      const crearedata = {
        account_id: 1136,
        package_id: 1333,
        exp_time_type: "day",
        exp_time_value: 1,
        expiry: null,
        key_prefix: "adammama",
        key_activation_limit: 1,
        quantity: 1,
      };
      await axios.post(apiUrl3, crearedata, { headers });
    }

    return res.status(200).send(response2.data.data[0].value);
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

module.exports = key;
