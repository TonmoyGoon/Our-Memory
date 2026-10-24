
const express = require("express");
const multer = require("multer");
const Database = require("better-sqlite3");
const mime = require("mime-types");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;

const PROJECT_ROOT = path.join(__dirname, "..");
const UPLOADS_DIR = path.join(__dirname, "Uploads");
const DATABASE_PATH = path.join(__dirname, "memory.db");

// The five existing upload destinations.
const CATEGORIES = {
    Tiasha: "Tiasha",
    Tonmoy: "Tonmoy",
    Combine: "Combine",
    Videos: "Videos",
    Artwork: "Artwork"
};

// Create any missing upload directories.
for (const folder of Object.values(CATEGORIES)) {
    fs.mkdirSync(path.join(UPLOADS_DIR, folder), {
        recursive: true
    });
}

// Open or create the SQLite database.
const db = new Database(DATABASE_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        folder TEXT NOT NULL,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(category, filename)
    );
`);

const insertMedia = db.prepare(`
    INSERT OR IGNORE INTO media
        (category, folder, filename, original_name, mime_type)
    VALUES
        (@category, @folder, @filename, @originalName, @mimeType)
`);

const selectAllMedia = db.prepare(`
    SELECT id, category, folder, filename,
           original_name, mime_type, created_at
    FROM media
    ORDER BY id ASC
`);

const selectByCategory = db.prepare(`
    SELECT id, category, folder, filename,
           original_name, mime_type, created_at
    FROM media
    WHERE category = ?
    ORDER BY id ASC
`);

// Convert a database record into a frontend-friendly object.
function formatMedia(row) {
    return {
        id: row.id,
        category: row.category,
        originalName: row.original_name,
        mimeType: row.mime_type,
        url:
            "/uploads/" +
            row.folder +
            "/" +
            encodeURIComponent(row.filename),
        createdAt: row.created_at
    };
}

// Register existing supported media files in the database.
// This does not move or rename those files.
function registerExistingMedia() {
    for (const [category, folder] of Object.entries(CATEGORIES)) {
        const folderPath = path.join(UPLOADS_DIR, folder);

        for (const filename of fs.readdirSync(folderPath)) {
            const filePath = path.join(folderPath, filename);

            if (!fs.statSync(filePath).isFile()) {
                continue;
            }

            const mimeType = mime.lookup(filePath);

            if (!mimeType) {
                continue;
            }

            const isImage = mimeType.startsWith("image/");
            const isVideo = mimeType.startsWith("video/");

            const valid =
                category === "Videos"
                    ? isVideo
                    : category === "Artwork" ||
                      ["Tiasha", "Tonmoy", "Combine"].includes(category)
                        ? isImage
                        : false;

            if (!valid) {
                continue;
            }

            insertMedia.run({
                category,
                folder,
                filename,
                originalName: filename,
                mimeType
            });
        }
    }
}

registerExistingMedia();

// Serve saved media through URLs such as /uploads/tiasha/photo.jpg.
app.use("/uploads", express.static(UPLOADS_DIR));

// API: retrieve all saved media, or filter by category.

app.get("/api/media", (req, res) => {
    const category = req.query.category;

    if (category && !Object.hasOwn(CATEGORIES, category)) {
        return res.status(400).json({
            error: "Invalid media category."
        });
    }

    // Find every saved database record.
    const allRows = selectAllMedia.all();
    const existingRows = [];

    // Remove records whose actual files no longer exist.
    for (const row of allRows) {
        const filePath = path.join(
            UPLOADS_DIR,
            row.folder,
            row.filename
        );

        if (fs.existsSync(filePath)) {
            existingRows.push(row);
        } else {
            db.prepare(
                "DELETE FROM media WHERE id = ?"
            ).run(row.id);
        }
    }

    // Return only existing files, optionally filtered by category.
    const rows = category
        ? existingRows.filter(row => row.category === category)
        : existingRows;

    res.json({
        items: rows.map(formatMedia)
    });
});


// Configure upload validation and storage.
const storage = multer.diskStorage({
    destination(req, file, callback) {
        const category = req.body.category;
        const folder = CATEGORIES[category];

        if (!folder) {
            return callback(
                new Error("Please select a valid upload category.")
            );
        }

        callback(null, path.join(UPLOADS_DIR, folder));
    },

    filename(req, file, callback) {
        const extension =
            path.extname(file.originalname).toLowerCase() ||
            "." + (mime.extension(file.mimetype) || "bin");

        callback(null, crypto.randomUUID() + extension);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 100 * 1024 * 1024
    },

    fileFilter(req, file, callback) {
        const category = req.body.category;

        if (!Object.hasOwn(CATEGORIES, category)) {
            return callback(
                new Error("Please select a valid upload category.")
            );
        }

        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");

        const valid =
            category === "Videos"
                ? isVideo
                : category === "Artwork" ||
                  ["Tiasha", "Tonmoy", "Combine"].includes(category)
                    ? isImage
                    : false;

        if (!valid) {
            return callback(
                new Error(
                    category === "Videos"
                        ? "Please upload a video file."
                        : "Please upload an image file."
                )
            );
        }

        callback(null, true);
    }
});

// API: save a new upload and record it in SQLite.
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "No file was uploaded."
        });
    }

    const category = req.body.category;
    const folder = CATEGORIES[category];

    try {
        const result = insertMedia.run({
            category,
            folder,
            filename: req.file.filename,
            originalName: path.basename(req.file.originalname),
            mimeType: req.file.mimetype
        });

        const row = db.prepare(`
            SELECT id, category, folder, filename,
                   original_name, mime_type, created_at
            FROM media
            WHERE id = ?
        `).get(result.lastInsertRowid);

        return res.status(201).json({
            item: formatMedia(row)
        });
    } catch (error) {
        // Avoid leaving an unrecorded file if saving metadata fails.
        fs.unlink(
            req.file.path,
            () => {}
        );

        console.error("Database save failed:", error);

        return res.status(500).json({
            error: "The upload could not be saved."
        });
    }
});

// Do not expose backend code or the SQLite database as static files.
app.use((req, res, next) => {
    if (
        req.path === "/backend" ||
        req.path.startsWith("/backend/")
    ) {
        return res.sendStatus(404);
    }

    next();
});

// Serve the existing website without changing its layout or CSS.
app.use(express.static(PROJECT_ROOT));

// Handle upload validation and file-size errors.
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof multer.MulterError) {
        const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

        return res.status(status).json({
            error:
                error.code === "LIMIT_FILE_SIZE"
                    ? "The file exceeds the 100 MB limit."
                    : error.message
        });
    }

    console.error("Request failed:", error);

    res.status(400).json({
        error: error.message || "The request failed."
    });
});

app.listen(PORT, () => {
    console.log(`Our Memory is running at http://localhost:${PORT}`);
});
