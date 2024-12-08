import cors from "cors";
import express from "express";
import mysql from "mysql";

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

// Get all members
app.get("/member", (req, res)=>{
    const q = "SELECT * FROM member"
    db.query(q, (err,data)=>{
        if (err) return res.json(err)
        return res.json(data)
    })
})

// Get items based on member where order_status is not 'Completed'
app.get("/items/member", (req, res) => {
    const memberId = req.query.member_id;
    const q = "SELECT i.*, o.order_status FROM items AS i LEFT JOIN orders AS o ON i.item_id = o.items_id WHERE (o.order_status IS NULL OR o.order_status != 'Completed')"
    db.query(q, [memberId], (err, data) => {
        if (err) {
            console.error("Error fetching items for member:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
});

// Get all items
app.get("/items", (req, res)=>{
    const q = "SELECT i.*, o.order_status FROM items AS i LEFT JOIN orders AS o ON i.item_id = o.items_id WHERE (o.order_status IS NULL OR o.order_status != 'Completed')"
    db.query(q, (err,data)=>{
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post("/items", (req, res) => {
    const { item_name, item_condition, size, description, price, item_photo, member_id } = req.body;
  
    // Validate that member_id is included
    if (!member_id) {
      return res.status(400).json({ message: "Member ID is required." });
    }
  
    const q = "INSERT INTO items (item_name, item_condition, size, description, price, item_photo, member_id)  VALUES (?)`"
;
  
    const values = [
      item_name,
      item_condition,
      size,
      description,
      price,
      item_photo,
      member_id, // member_id is passed here
    ];
  
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Item has been created");
    });
  });
  

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
            member_id: data[0].id, // Ensure member_id is included
            name: data[0].fname,
            role: data[0].role, // Include role in the response
        };
        console.log(data); // Check what data is coming from the DB
        return res.status(200).json({ member_id: data[0].id, name: data[0].fname, role:data[0].role});
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

app.delete("/items/:item_id", (req, res)=>{
    const item_id = req.params.item_id;
    const q = "DELETE FROM items WHERE item_id = ?";

    db.query(q,[item_id], (err, data)=>{
        if (err) return res.status(500).json(err);
        return res.status(200).json("Item deleted");
    }
);
});

app.put("/items/:item_id", (req, res) => {
    const { item_id } = req.params;
    const { item_name, price, description, size, item_photo, item_condition } = req.body;
  
    const q = "UPDATE items SET item_name = ?, item_condition = ?, size = ?, price = ?, description = ?, item_photo = ? WHERE item_id = ?";
    db.query(q, [item_name, item_condition, size, price, description, item_photo, item_id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Item updated successfully");
    });
});

// Create new order
app.post("/orders", (req, res) => {
    const { total_cost, order_status, member_id, items_id } = req.body;
    
    // Convert member_id and items_id to integers
    const memberId = parseInt(member_id);
    const itemsId = parseInt(items_id);
    
    // Validate required fields and types
    if (!total_cost || !order_status || !memberId || !itemsId) {
        console.error("Missing or invalid required fields:", { total_cost, order_status, memberId, itemsId });
        return res.status(400).json("Missing or invalid required fields");
    }

    // Verify member exists before creating order
    db.query("SELECT id FROM member WHERE id = ?", [memberId], (err, memberResult) => {
        if (err) {
            console.error("Error checking member:", err);
            return res.status(500).json(err);
        }
        
        if (memberResult.length === 0) {
            return res.status(404).json("Member not found");
        }

        // Verify item exists
        db.query("SELECT item_id FROM items WHERE item_id = ?", [itemsId], (err, itemResult) => {
            if (err) {
                console.error("Error checking item:", err);
                return res.status(500).json(err);
            }
            
            if (itemResult.length === 0) {
                return res.status(404).json("Item not found");
            }

            // Create the order
            const q = "INSERT INTO orders (cost, order_status, member_id, items_id) VALUES (?, ?, ?, ?)";
            db.query(q, [total_cost, order_status, memberId, itemsId], (err, data) => {
                if (err) {
                    console.error("Error creating order:", err);
                    return res.status(500).json(err);
                }
                return res.status(200).json({
                    message: "Order has been created",
                    orderId: data.insertId
                });
            });
        });
    });
});

// Get order
app.get("/orders", (req, res) => {
    const q = "SELECT o.order_id, o.cost, o.order_status, o.funds_released, i.item_id, i.item_name, i.price, i.item_photo, b.fname AS buyer_fname, b.lname AS buyer_lname, s.fname AS seller_fname, s.lname AS seller_lname FROM orders AS o JOIN items AS i ON o.items_id = i.item_id JOIN member AS b ON o.member_id = b.id JOIN member AS s ON i.member_id = s.id WHERE o.archived = 0 ORDER BY o.order_id DESC"

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// get buyer's orders
app.get("/orders/buyer/:member_id", (req, res) => {
    const memberId = req.params.member_id;
    const q = "SELECT o.order_id, o.cost, o.order_status, i.item_id, i.item_name, i.item_photo, i.price, i.description, i.size, i.item_condition, m.fname AS seller_fname, m.lname AS seller_lname FROM orders AS o JOIN items AS i ON o.items_id = i.item_id JOIN member AS m ON m.id = i.member_id WHERE o.member_id = ? AND o.archived = 0 ORDER BY o.order_id DESC"

    db.query(q, [memberId], (err, data) => {
        if (err) {
            console.error("Error fetching buyer orders:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
});

//  update the order status endpoint
app.put("/orders/:order_id", (req, res) => {
    const { order_id } = req.params;
    const { order_status, funds_released } = req.body;  
    
    const q = "UPDATE orders SET order_status = ?, funds_released = ? WHERE order_id = ?";
    db.query(q, [order_status, funds_released, order_id], (err, data) => {
        if (err) {
            console.error("Error updating order:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Order updated successfully");
    });
});

app.put("/orders/archive/:order_id", (req, res) => {
    const { order_id } = req.params;
    console.log(`Archiving order with ID: ${order_id}`); // Debugging


    const q = "UPDATE orders SET archived = '1' WHERE order_id = ?";
    db.query(q, [order_id], (err, data) => {
        if (err) {
            console.error("Error updating order:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Order updated successfully");
    });
});

// for seller's orders
app.get("/orders/seller/:member_id", (req, res) => {
    const sellerId = req.params.member_id;
    const q = `
        SELECT 
            o.order_id, 
            o.cost,
            o.order_status,
            i.item_id, 
            i.item_name, 
            i.item_photo,
            i.price,
            i.description,
            i.size,
            i.item_condition,
            m.fname as buyer_fname,
            m.lname as buyer_lname
        FROM orders o
        JOIN items i ON o.items_id = i.item_id
        JOIN member m ON m.id = o.member_id
        WHERE i.member_id = ? AND o.archived = 0
        ORDER BY o.order_id DESC`;

    db.query(q, [sellerId], (err, data) => {
        if (err) {
            console.error("Error fetching seller orders:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
});

// for calculating total profits
app.get("/profits/seller/:seller_id", (req, res) => {
    const sellerId = req.params.seller_id;
    const q = `
        SELECT COALESCE(SUM(o.cost), 0) as total
        FROM orders o
        JOIN items i ON o.items_id = i.item_id
        WHERE i.member_id = ? 
        AND o.order_status = 'Completed'
        AND o.funds_released = TRUE`;
    db.query(q, [sellerId], (err, data) => {
        if (err) {
            console.error("Error fetching profits:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json({ total: data[0].total || 0 });
    });
});

// Add this test endpoint
app.get("/check-orders/:seller_id", (req, res) => {
    const sellerId = req.params.seller_id;
    const q = `
        SELECT o.*, i.member_id as seller_id 
        FROM orders o
        JOIN items i ON o.items_id = i.item_id
        WHERE i.member_id = ?`;

    db.query(q, [sellerId], (err, data) => {
        if (err) {
            console.error("Error checking orders:", err);
            return res.status(500).json(err);
        }
        console.log("Orders found:", data);
        return res.status(200).json(data);
    });
});

// for seller's orders archived
app.get("/orders/seller/archieved/:member_id", (req, res) => {
    const sellerId = req.params.member_id;
    const q = `
        SELECT 
            o.order_id, 
            o.cost,
            o.order_status,
            i.item_id, 
            i.item_name, 
            i.item_photo,
            i.price,
            i.description,
            i.size,
            i.item_condition,
            m.fname as buyer_fname,
            m.lname as buyer_lname
        FROM orders o
        JOIN items i ON o.items_id = i.item_id
        JOIN member m ON m.id = o.member_id
        WHERE i.member_id = ? AND o.archived = 1
        ORDER BY o.order_id DESC`;

    db.query(q, [sellerId], (err, data) => {
        if (err) {
            console.error("Error fetching seller orders:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
});
// Delete all orders related to an item
app.delete("/orders/item/:item_id", (req, res) => {
    const itemId = req.params.item_id;
    const q = "DELETE FROM orders WHERE items_id = ?";
    
    db.query(q, [itemId], (err, data) => {
        if (err) {
            console.error("Error deleting orders:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Orders deleted successfully");
    });
});

// items
app.delete("/items/:item_id", (req, res) => {
    const itemId = req.params.item_id;
    console.log(`Deleting item with ID: ${itemId}`); // Debugging log

    const q = "DELETE FROM items WHERE item_id = ?";

    db.query(q, [itemId], (err, data) => {
        if (err) {
            console.error("Error deleting item:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Item deleted successfully");
    });
});

// Create new payment
app.post("/payments", (req, res) => {
    const { payment_type, card_number, expiration_date, cvc } = req.body;
    
    const q = "INSERT INTO payment (payment_type, card_number, expiration_date, cvc) VALUES (?, ?, ?, ?)";
    
    db.query(q, [payment_type, card_number, expiration_date, cvc], (err, result) => {
        if (err) {
            console.error("Error creating payment:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json({ paymentId: result.insertId });
    });
});

// Create new transaction
app.post("/transactions", (req, res) => {
    const { transaction_status, transaction_date, total_cost, order_id, member_id, payment_id } = req.body;
    
    const q = `
        INSERT INTO transaction 
        (transaction_status, transaction_date, total_cost, order_id, member_id, payment_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(q, [transaction_status, transaction_date, total_cost, order_id, member_id, payment_id], (err, result) => {
        if (err) {
            console.error("Error creating transaction:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json({ transactionId: result.insertId });
    });
});

// fetch buyer transactions
app.get("/transactions/buyer/:member_id", (req, res) => {
    const memberId = req.params.member_id;
    const q = `
        SELECT 
            t.transaction_id,
            t.transaction_date,
            t.transaction_status,
            t.total_cost,
            p.payment_type,
            m.fname as seller_fname,
            m.lname as seller_lname
        FROM transaction t
        JOIN orders o ON t.order_id = o.order_id
        JOIN items i ON o.items_id = i.item_id
        JOIN member m ON i.member_id = m.id
        JOIN payment p ON t.payment_id = p.payment_id
        WHERE t.member_id = ?
        ORDER BY t.transaction_date DESC`;

    db.query(q, [memberId], (err, data) => {
        if (err) {
            console.error("Error fetching transactions:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
});


app.listen(8800, () =>{
    console.log("Connected to backend!")
})