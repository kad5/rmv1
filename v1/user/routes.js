const { Router } = require("express");
const { validateAccessToken, protectedAccess } = require("../auth/mw");
const validate = require("./validation");

const notes = require("./notes/notes");
const fb = require("./feedback/feedback");
const pref = require("./preferences/preferences");
const favs = require("./favorites/fav");

const router = Router();
// api/v1/user

router.use(validateAccessToken);

// notes add, delete, update, and get all for a course or a specific one.
router.post("/notes", notes.createNote);
router.get("/notes", notes.getUserNotes);
router.get("/notes/:id", notes.getNoteById);
router.put("/notes/:id", notes.updateNote);
router.delete("/notes/:id", notes.deleteNote);

// feedback for a lesson, quiz, or exam
router.post("/feedback", fb.addFeedback);

//preferences: global and local preferences
router.get("/preferences", pref.getPreferences);
router.post("/preferences", pref.upsertPreference);
router.delete("/preferences", pref.deletePreference);
router.get("/preference/:key/:productId", pref.getPreference);

// favorites: add and remove anything to favorites
router.get(
  "/favorites/:providerId",
  protectedAccess("providerId"),
  favs.getFavoritesByProvider
);
router.post(
  "/favorites/:providerId/:type/:targetId",
  protectedAccess("providerId"),
  favs.addFavorite
);

router.delete(
  "/favorites/:providerId/:type/:targetId",
  protectedAccess("providerId"),
  favs.removeFavorite
);

module.exports = router;
