import express, { Express, Request, Response } from "express";
import axios from "axios";

const app: Express = express();
const PORT = 3000;

// app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World with ghaz xpress and TypeScript!");
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
    // const { imageName } = req.params;
    // const imageUrl = "http://localhost:8000/images/getImage";

    // try {
    //     const postData = {
    //         image_name: imageName, // Example data, adjust as needed
    //     };

    //     const response = await axios({
    //         method: "POST",
    //         url: imageUrl,
    //         responseType: "stream",
    //         data: postData, // Include the data in the request
    //         headers: {
    //             "Content-Type": "application/json", // Set appropriate content type for JSON
    //         },
    //     });
    //     // Set the content type of the response
    //     res.setHeader("Content-Type", response.headers["content-type"]);

    //     // Pipe the image data directly to the response
    //     response.data.pipe(res);
    // } catch (error) {
    //     console.error("Error fetching image:", error);
    //     res.status(500).send("Failed to fetch image");
    // }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
