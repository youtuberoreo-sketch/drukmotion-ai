import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.use(express.static("public"));

if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY });
}

app.post("/api/generate", upload.single("image"), async (req, res) => {
  try {
    if (!process.env.FAL_KEY) {
      return res.status(500).json({
        error: "FAL_KEY is not configured on the server."
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image was uploaded." });
    }

    const prompt = (req.body.prompt || "").trim();
    if (!prompt) {
      return res.status(400).json({ error: "Please enter an animation prompt." });
    }

    // Upload the user's image to fal storage from the server.
    const file = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype
    });
    const imageUrl = await fal.storage.upload(file);

    const duration = Number(req.body.duration || 5);
    const validDuration = [5, 10, 15].includes(duration) ? duration : 5;

    const result = await fal.subscribe("wan/v2.6/image-to-video", {
      input: {
        image_url: imageUrl,
        prompt,
        duration: validDuration,
        resolution: "720p",
        enable_prompt_expansion: true,
        enable_safety_checker: true
      },
      logs: true
    });

    const videoUrl = result?.data?.video?.url;
    if (!videoUrl) {
      return res.status(502).json({
        error: "The video model completed without returning a video URL."
      });
    }

    res.json({ videoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err?.message || "Video generation failed."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`DrukMotion AI running at http://localhost:${port}`);
});
