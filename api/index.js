import  express  from "express";
import cors from "cors";// Import module cors
import data from "../server/index.server.js";
import key from "../server/key.server.js"; 
const app = express();

// app.use(cors({
//     origin: true,
//     credentials: true
//   })); // Sử dụng cors middleware
app.get("/", (req, res) => {
  return data(req, res);
});
app.get("/key", (req, res) => {
  return key(req, res); 
});
// // Các cấu hình và định nghĩa routes khác

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
