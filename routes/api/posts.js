const express = require("express");
const router = express.Router();

//@route GET api/posts/test
//@desc  Test post route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Posts Work" }));

module.exports = router;
