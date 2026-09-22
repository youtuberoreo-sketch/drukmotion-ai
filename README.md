# DrukMotion AI — real image-to-video generator

This version connects the website to fal.ai's Wan 2.6 image-to-video API.

## What it does
1. Upload an image.
2. Type an animation prompt.
3. Choose 5, 10, or 15 seconds.
4. Click Generate Video.
5. The server sends the image + prompt to the video model.
6. The generated MP4 appears in the preview and can be downloaded.

## Important
The API key MUST stay on the server. Do not put FAL_KEY in `public/index.html`.

## Setup on a computer
Install Node.js 20+.

Then in this folder:
```bash
npm install
```

Create a file named `.env`:
```env
FAL_KEY=YOUR_FAL_API_KEY
PORT=3000
```

Start:
```bash
npm start
```

Open:
http://localhost:3000

## API provider
This project uses the `wan/v2.6/image-to-video` endpoint. The provider charges according to its current pricing. The website itself is just the interface; generation costs come from the model provider.

## iPad
An iPad can use the finished hosted website in Safari, but it cannot normally run this Node.js backend by itself. Deploy the project to a Node-compatible host (for example Vercel/Render/Railway) and add FAL_KEY as a server environment variable.
