import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cpsc471",
    database: "resellStore"
})

app.get("/", (req,res)=>{
    res.json("Hello this is the backend")
})

app.get("/member", (req, res)=>{
    const q = "SELECT * FROM member"
    db.query(q, (err,data)=>{
        if (err) return res.json(err)
        return res.json(data)
    })
})

// Get all items
app.get("/item", (req, res)=>{
    const q = "SELECT * FROM item"
    db.query(q, (err,data)=>{
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post("/api/item", (req, res) => {
    const q = `
        INSERT INTO item 
        (item_name, item_condition, size, description, price, item_photo, member_id) 
        VALUES (?)`;

    const values = [
        req.body.item_name,
        req.body.item_condition,
        req.body.size,
        req.body.description,
        req.body.price,
        req.body.item_photo,
        req.body.member_id // Attach the logged-in user's member_id
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Item has been created");
    });
});
;     


// Sign-up Endpoint
app.post("/api/signup", (req, res) => {
    const { fname, lname, address, email, password, phone, role } = req.body;
    const q = "INSERT INTO member (fname, lname, address, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(q, [fname, lname, address, email, password, phone, role], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User registered successfully!");
    });
});

// Login Endpoint
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const q = "SELECT * FROM member WHERE email = ? AND password = ?";
    db.query(q, [email, password], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(401).json("Invalid email or password");
       
        const user = {
            member_id: data[0].member_id, // Ensure member_id is included
            name: data[0].fname,
            role: data[0].role, // Include role in the response
        };

        return res.status(200).json({ name: data[0].fname, role:data[0].role});
    });
});
app.get("/test-db", (req, res) => {
    db.query("SELECT 1", (err, result) => {
        if (err) {
            console.error("Database connection failed:", err.message);
            return res.status(500).json({ message: "Database connection failed." });
        }
        res.status(200).json({ message: "Database connection successful!" });
    });
});
app.listen(8800, () =>{
    console.log("Connected to backend!")
})