import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

let userData: Array<Record<string, string>> = [];

app.use(cors()); //Emable CORS

app.post("/api/files", upload.single("file"), async (req, res) => {
  //Extract file from request
  const { file } = req;
  //validate that we have file
  if (!file) return res.status(500).json({ message: "File is required" });
  //validate mimetype (csv)
  if (file.mimetype !== "text/csv")
    return res.status(500).json({ message: "File must be a CSV" });
  //transform file(buffer) to string
  let json: Array<Record<string, string>>;
  try {
    const csv = Buffer.from(file.buffer).toString("utf-8");
    console.log(csv);
    //transform string to JSON
    json = csvToJson.csvStringToJson(csv);
  } catch (error) {
    return res.status(500).json({ message: "Error parsing the file" });
  }
  //save json to db or memory
  userData = json;
  //return 200 with the json
  return res
    .status(200)
    .json({ data: json, message: "file loaded succesfully!" });
});

app.get("/api/users", async (req, res) => {
  //extract query params
  const { q } = req.query;
  //validate that we have the query param;
  if (!q)
    return res.status(500).json({ message: "Query param  q is required" });
  if (Array.isArray(q))
    return res.status(500).json({ message: "Query param must be a string" });
  //filter the data from the db or memory with the query param
  const search = q.toString().toLowerCase();

  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) => value.toLowerCase().includes(search));
  });
  //return 200 with the filtered data
  return res.status(200).json({ data: filteredData });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

