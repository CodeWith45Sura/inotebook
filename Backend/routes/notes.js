const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// ROUTE-1 : Get all the Notes using: GET "/api/notes/fetchallnotes". Login require
try {
  router.get("/fetchallnotes", fetchuser, async (req, res) => {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  });
} catch (error) {
  // catch error
  console.log(error.message);
  res.status(500).send("Internal Server Error ");
}

// ROUTE-2 : Add Notes using: POST "/api/notes/addnote". Login require

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "description must be atleast contains 5 chars"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //if there are errors, return Bad request and the errors

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      // catch error
      console.log(error.message);
      res.status(500).send("Internal Server Error ");
    }
  }
);

// ROUTE-3 : Update Notes using: PUT "/api/notes/updatenote". Login require

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //Create newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    
    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found ");
    }
if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    // catch error
    console.log(error.message);
    res.status(500).send("Internal Server Error ");
  }
});

// ROUTE-4 : Delete Notes using: DELETE "/api/notes/deletenote". Login require

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    // catch error
    console.log(error.message);
    res.status(500).send("Internal Server Error ");
  }
});

module.exports = router;
