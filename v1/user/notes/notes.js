const { prisma } = require("../../config/prisma");

// Create Note
const createNote = async (req, res) => {
  try {
    const { providerId, targetId, content, type } = req.body;
    const { profileId } = req.user;

    const note = await prisma.note.create({
      data: { profileId, providerId, targetId, content },
    });

    res.status(201).json({ message: "Your note has been added" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
};

// Get All Notes for User
const getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;
    const notes = await prisma.note.findMany({
      where: { userId, type },
      orderBy: { updatedAt: "desc" },
    });
    res.json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notes", error: error.message });
  }
};

// Get Single Note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note || note.userId !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching note", error: error.message });
  }
};

// Update Note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const existingNote = await prisma.note.findUnique({ where: { id } });
    if (!existingNote || existingNote.userId !== userId) {
      return res.status(404).json({ message: "Note not found" });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { content, updatedAt: new Date() },
    });

    res.json(updatedNote);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating note", error: error.message });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingNote = await prisma.note.findUnique({ where: { id } });
    if (!existingNote || existingNote.userId !== userId) {
      return res.status(404).json({ message: "Note not found" });
    }

    await prisma.note.delete({ where: { id } });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
};

module.exports = {
  createNote,
  getNoteById,
  getUserNotes,
  updateNote,
  deleteNote,
};
