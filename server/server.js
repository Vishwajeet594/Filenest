import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// The client is built separately (npm run build) into client/dist.
const distPath = path.join(__dirname, "..", "client", "dist");

app.use(express.static(distPath));

// SPA fallback so client-side routes like /tools/merge-pdf work on refresh.
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Filenest is running on port ${PORT}`);
});
