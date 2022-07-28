const express = require("express");
const router = express.Router();
const findUser = require("../Middleware/findUser");
const Notes = require("../Models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1 : Get All the Notes : GET "/api/notes/fetchallnotes"
router.get("/fetchallnotes", findUser, async function (req, res) {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

// Route 2 : Add the Notes : GET "/api/notes/addnotes"
router.post(
  "/addNotes",
  findUser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async function (req, res) {
    const {title,description,tag} = req.body;
    // If there are Errors then response gives bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Notes({
            title,description,tag ,user : req.user.id,
        })
        const saved = await note.save();
        res.send(saved);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

    res.json();
  }
);

module.exports = router;
