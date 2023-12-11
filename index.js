const express = require("express");
const multer = require("multer");
const zlib = require("zlib");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/file-upload", upload.array("file"), (req, res) => {
  try {
    for (const file of req.files) {
      // console.log(file.originalname);
      // console.log(file.mimetype);
      // console.log(file.buffer.toString("utf-8"));

      console.log("ORIGINAL");
      console.log(file.buffer);

      const zipped = zlib.gzipSync(file.buffer);
      console.log(zlib.gzipSync(JSON.stringify(file)));
      console.log("ZIPPED");
      console.log(zipped);
      const final = zipped.toString("base64");
      console.log(final);

      console.log("BACK");
      const backToBase64 = Buffer.from(final, "base64");
      console.log(backToBase64);
      console.log(zlib.unzipSync(backToBase64));
      console.log(zlib.unzipSync(backToBase64).toString("utf-8"));
    }

    return res.send("files uploaded");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("app listening...");
});
