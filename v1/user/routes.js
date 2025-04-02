const { Router } = require("express");
const notes = require("./notes/notes");
const fb = require("./feedback/feedback");
const pref = require("./preferences/preferences");

const validate = require("./validation");
const { validateAccessToken } = require("../auth/mw");
const router = Router();

router.use(validateAccessToken);

// notes
router.post("/notes", notes.createNote);
router.get("/notes?type=X", notes.getUserNotes);
router.get("/notes/:id", notes.getNoteById);
router.put("/notes/:id", notes.updateNote);
router.delete("/notes/:id", notes.deleteNote);

// feedback
router.post("/feedback", fb.upsertFeedback);
router.get("/feedback", fb.getFeedback);

//preferences
router.get("/preferences", pref.getPreferences);
router.post("/preferences", pref.upsertPreference);
router.delete("/preferences", pref.deletePreference);
router.get("/preference/:key/:productId", pref.getPreference);

module.exports = router;
