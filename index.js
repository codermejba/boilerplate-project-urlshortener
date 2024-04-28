import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
// index.mjs
import { nanoid } from "nanoid";
import bodyPerser from "body-parser";
import { URL } from 'url';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyPerser.urlencoded({ extended: false }));

// Sample database (in-memory)
const urlDatabase = {};
console.log(urlDatabase);
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  if (!isValidUrl(url)) {
    return res.status(400).json({  error: 'invalid url' });
    
  }
  const shortUrl = nanoid(6); // Generate a unique ID with length 6
   // Save mapping in database
   urlDatabase[shortUrl] = url;
  res.json({ original_url: url, short_url: shortUrl });
  console.log(urlDatabase);
});
// Endpoint to redirect to original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
      res.redirect(originalUrl);
  } else {
      res.status(404).json({ error: 'Short URL not found' });
  } 
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
