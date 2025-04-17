const { prisma } = require("../config/prisma");
const asyncHandler = require("express-async-handler");

const createCase = asyncHandler(async (req, res) => {
  const data = req.body;
  const c = await prisma.case.create({ data });
  if (c) return res.status(200).json(c);
});

/*
const createCase = asyncHandler(async (req, res) => {
  const {
    cardId,
    order,
    title,
    module,
    metadata,
    viva,
    rapids,
    longs,
    highYield,
    images,
    content,
  } = req.body;

  // Validation
  if (
    !cardId ||
    !Number.isInteger(order) ||
    !title ||
    !module ||
    !images ||
    !content
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: cardId, order, title, module, images, content",
    });
  }

  const newCase = await prisma.case.create({
    data: {
      cardId,
      order,
      title,
      module,
      metadata,
      viva,
      rapids,
      longs,
      highYield,
      images,
      content,
    },
  });

  res.status(201).json({ success: true, data: newCase });
});
*/
const updateCase = asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const {
    cardId,
    order,
    title,
    module,
    metadata,
    viva,
    rapids,
    longs,
    highYield,
    images,
    content,
  } = req.body;

  const caseExists = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseExists) {
    return res.status(404).json({ message: "Case not found" });
  }

  const updatedCase = await prisma.case.update({
    where: { id: caseId },
    data: {
      cardId,
      order,
      title,
      module,
      metadata,
      viva,
      rapids,
      longs,
      highYield,
      images,
      content,
    },
  });

  res.status(200).json({ success: true, data: updatedCase });
});

const deleteCase = asyncHandler(async (req, res) => {
  const { caseId } = req.params;

  const caseExists = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseExists) {
    return res.status(404).json({ message: "Case not found" });
  }

  await prisma.case.delete({
    where: { id: caseId },
  });

  res.status(200).json({ success: true, message: "Case deleted successfully" });
});

const getCase = asyncHandler(async (req, res) => {
  const { caseId } = req.params;

  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
  });

  if (!caseData) {
    return res.status(404).json({ message: "Case not found" });
  }

  res.status(200).json({ success: true, data: caseData });
});

module.exports = { getCase, createCase, deleteCase, updateCase };
