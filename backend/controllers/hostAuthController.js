const Host = require("../models/Host");
const SECRET_KEY = process.env.HOST_SECRET_KEY;

// POST /api/host/register
exports.register = async (req, res) => {
  try {
    const { username, password, secret } = req.body;
    if (!username || !password || !secret) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!SECRET_KEY) {
      return res.status(500).json({ message: "Host secret key is not configured on the server" });
    }
    if (secret !== SECRET_KEY) {
      return res.status(403).json({ message: "Invalid secret key" });
    }
    const existing = await Host.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Host username already exists" });
    }
    const host = new Host({ username, password });
    await host.save();
    req.session.host = { id: host._id, username: host.username };
    res
      .status(201)
      .json({
        message: "Host registered",
        host: { id: host._id, username: host.username },
      });
  } catch (err) {
    console.error("Host register error:", err);
    res.status(500).json({ message: "Failed to register host" });
  }
};

// POST /api/host/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const host = await Host.findOne({ username });
    if (!host) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await host.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.host = { id: host._id, username: host.username };
    res
      .status(200)
      .json({
        message: "Host login successful",
        host: { id: host._id, username: host.username },
      });
  } catch (err) {
    console.error("Host login error:", err);
    res.status(500).json({ message: "Failed to login host" });
  }
};

// POST /api/host/logout
exports.logout = (req, res) => {
  req.session.host = null;
  res.status(200).json({ message: "Host logged out" });
};
