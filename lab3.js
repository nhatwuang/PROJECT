const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Lưu thông tin vào file
app.post("/save", (req, res) => {
    const data = req.body;

    let list = [];
    if (fs.existsSync("data.json")) {
        list = JSON.parse(fs.readFileSync("data.json"));
    }
    list.push(data);
    fs.writeFileSync("data.json", JSON.stringify(list, null, 2));

    res.send("Lưu thành công!");
});

// Lấy danh sách thông tin
app.get("/list", (req, res) => {
    if (fs.existsSync("data.json")) {
        const list = JSON.parse(fs.readFileSync("data.json"));
        res.json(list);
    } else {
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
