import express from "express";
import { exec } from "child_process";
import cors from "cors";
import { promises as fs } from "fs";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const execPromise = promisify(exec);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve React frontend from the "client/build" folder
app.use(express.static(path.join(__dirname, "..", "client", "dist")))

// Route to save data to a file
app.post("/write", async (req, res) => {
	try {
		const apartment = Object.keys(req.body)[0];
		const data = req.body[apartment];
		const FILEPATH = path.join(__dirname, "data", `${apartment}.json`);

		// Write the file (will create or overwrite)
		await fs.writeFile(FILEPATH, JSON.stringify(data));
		res.json({ message: "File saved successfully" });
	} catch (error) {
		console.error("Error writing file:", error);
		res.status(500).json({ message: "Failed to write file" });
	}
});

// Route to read file(s)
app.get("/read", async (req, res) => {
	try {
		const apartment = req.query.name;

		if (apartment === "overView") {
			// List all JSON files using fd command
			const DATA_PATH = path.join(__dirname, "data");
			const { stdout } = await execPromise(`fd .json ${DATA_PATH}`);
			const FULLPATHS = stdout.split("\n").filter(e => e);
			const FILEPATHS = FULLPATHS.map(e => e.split("/").pop()).map(e => e?.slice(0, -5));

			// Read and parse all files concurrently
			const data = await Promise.all(
				FILEPATHS.map(async (name, index) => {
					try {
						await fs.access(FULLPATHS[index]);
						const data = await fs.readFile(FULLPATHS[index], "utf-8");
						return { [String(name)]: JSON.parse(data) };
					} catch (error) {
						console.error(`Error processing file ${name}:`, error);
						return { [String(name)]: null };
					}
				})
			);
			res.json(data);
		} else {
			const FILEPATH = path.join(__dirname, "data", `${apartment}.json`);
			try {
				await fs.access(FILEPATH);
				const data = await fs.readFile(FILEPATH, "utf-8");
				res.json(JSON.parse(data));
			} catch (error) {
				res.json([]);
			}
		}
	} catch (error) {
		console.error("Error in /read:", error);
		res.status(500).json({ message: "Failed to read file" });
	}
});

// Serve React frontend for unknown routes
app.get("*", (_, res) => {
	res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"))
});

// Start server
const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
