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

// Route 2 : Add the Notes : GET "/api/notes/addNotes"
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


// Route 2 : Update the Notes : GET "/api/notes/updateNotes" .
router.put(
    "/updateNotes/:id",
    findUser,
    async function (req, res) {
        const {title,description,tag} = req.body;
        // Create a note object
        const newNote = {};
        if (title) {newNote.title = title}
        if (description) {newNote.description = description}
        if (tag) {newNote.tag = tag}

        // Find the note to be updated and update it.
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set :newNote} , {new:true});
        res.json({note});
    });

module.exports = router;
