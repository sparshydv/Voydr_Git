require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// ✅ MongoDB Connection
// =====================================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// =====================================================
// ✅ User Schema + Auth
// =====================================================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// ---------------- SIGNUP ----------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ success: true, user: newUser });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Signup failed" });
  }
});

// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    res.json({ success: true, user });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Login failed" });
  }
});


// =====================================================
// ✅ Limits Schema
// =====================================================
const limitSchema = new mongoose.Schema({
  userId: String,
  site: String,
  limit: Number,
});

const Limit = mongoose.model("Limit", limitSchema);

// Set / Update limit
app.post("/setLimit", async (req, res) => {
  const { userId, site, limit } = req.body;

  let existing = await Limit.findOne({ userId, site });

  if (existing) {
    existing.limit = limit;
    await existing.save();
  } else {
    await Limit.create({ userId, site, limit });
  }

  res.json({ success: true });
});

// Get user limits
app.get("/limits/:userId", async (req, res) => {
  const limits = await Limit.find({ userId: req.params.userId });
  res.json(limits);
});

app.post("/deleteLimit", async (req, res) => {
  const { userId, site } = req.body;

  await Limit.deleteOne({ userId, site });

  res.json({ success: true });
});


// =====================================================
// ✅ Screen Time Schema + /sync
// =====================================================
const screenTimeSchema = new mongoose.Schema({
  userId: String,
  site: String,
  timeSpent: Number,
  timestamp: { type: Date, default: Date.now }
});
const ScreenTime = mongoose.model("ScreenTime", screenTimeSchema);

app.post("/sync", async (req, res) => {
  try {
    console.log("🔔 /sync called. body:", req.body);

    const { userId, usage } = req.body;

    if (!userId) {
      console.log("❌ /sync missing userId");
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    if (!usage || typeof usage !== "object") {
      console.log("❌ /sync missing usage object");
      return res.status(400).json({ success: false, message: "Missing usage object" });
    }

    const docs = Object.entries(usage).map(([site, time]) => ({
      userId,
      site,
      timeSpent: Number(time),
      timestamp: new Date()
    }));

    console.log("📥 Inserting sample:", docs.slice(0, 4));

    const inserted = await ScreenTime.insertMany(docs);

    console.log("✅ Inserted:", inserted.length);

    res.json({ success: true, inserted: inserted.length });

  } catch (err) {
    console.error("❌ /sync error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Get All Data for a User
app.get("/data", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }
    
    const data = await ScreenTime.find({ userId });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


// =====================================================
// ✅ Chatbot (Groq AI) – FINAL FIXED VERSION
// =====================================================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chatbot", async (req, res) => {
  console.log("🔥 Chatbot route HIT:", req.body);

  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "UserId and message required" });
    }

    // Fetch screen-time
    const records = await ScreenTime.find({ userId });

    // Summarize usage
    const siteTotals = {};
    for (let r of records) {
      siteTotals[r.site] = (siteTotals[r.site] || 0) + r.timeSpent;
    }

    const topSites = Object.entries(siteTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([site, time]) => `${site}: ${time.toFixed(1)} mins`)
      .join("\n");

    const prompt = `
User asked: "${message}"

Here is the user's screen-time summary:
${topSites}

Give a short, friendly insight about:
- Usage habits
- Productivity issues
- Suggestions to improve
`;

    // CALL GROQ SAFELY
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a digital wellbeing coach who gives short, helpful advice." },
        { role: "user", content: prompt }
      ],
      max_tokens: 250
    });

    const reply = completion.choices?.[0]?.message?.content || "No response.";

    return res.json({ reply });

  } catch (error) {
    console.error("Chatbot Error:", error);

    // Prevent UI crash
    return res.json({
      reply: "I'm having trouble processing your data right now 😅. Try again soon!"
    });
  }
});


// =====================================================
// ✅ Start Server
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
mongoose.connection.once("open", () => {
  console.log("📦 Connected DB:", mongoose.connection.name);
});

