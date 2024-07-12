import axios from "axios";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import fs from "fs";

const app: Express = express();
app.use(cors());

const socketPath= "/PATH_TO_SOCK.sock"

app.get("/", (req: Request, res: Response) => {
    res.send("Service is up & running.");
});

app.get("/images/:imageName", async (req: Request, res: Response) => {
    const { imageName } = req.params;
    const imageUrl = `http://localhost:8000/${imageName}`;
    try {
        const response = await axios({
            method: "GET",
            url: imageUrl,
            responseType: "stream",
        });

        // Set the content type of the response
        res.setHeader("Content-Type", response.headers["content-type"]);

        // Pipe the image data directly to the response
        response.data.pipe(res);
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).send("Failed to fetch image");
    }
});

function cleanupSocketFile(socketPath: string) {
    if (fs.existsSync(socketPath)) {
        fs.unlinkSync(socketPath);
    }
}

cleanupSocketFile(socketPath)
app.listen(socketPath, () => {
    console.log(`Server is running`);
});


// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT. Exiting...');
    cleanupSocketFile(socketPath);
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Exiting...');
    cleanupSocketFile(socketPath);
    process.exit(0);
});