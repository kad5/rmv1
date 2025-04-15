const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const getCourseDb = asyncHandler(async (req, res) => {
  const profileId = req.user.profileId;
  const { courseId } = req.params;

  try {
    const [layoutData, progressData] = await Promise.all([
      getCourseLayoutData(courseId),
      getCourseProgressData(profileId, courseId),
    ]);
    /*    const completedSet = new Set(
      progressData
        .filter((item) => item.completed)
        .map((item) => item.courseContnetId)
    );*/
    const completedSet = new Set(
      progressData.map((item) => item.courseContnetId)
    );
    const groupedByWeek = layoutData.reduce((acc, lesson) => {
      const week = lesson.week || 0;
      const lessonWithCompleted = {
        ...lesson,
        completed: completedSet.has(lesson.id),
      };

      if (!acc[week]) acc[week] = [];
      acc[week].push(lessonWithCompleted);

      return acc;
    }, {});
    const sortedWeeks = Object.entries(groupedByWeek)
      .sort(([weekA], [weekB]) => Number(weekA) - Number(weekB))
      .map(([week, lessons]) => ({
        week: Number(week),
        lessons: lessons.sort((a, b) => a.order - b.order),
      }));

    return res.status(200).json(sortedWeeks);
  } catch (error) {
    console.error("Error in getCourseDb:", error);
    throw new Error("Failed to load course data.");
  }
});

const getCourseLayoutData = async (courseId) => {
  try {
    return await prisma.courseContnet.findMany({
      where: { courseId },
      select: {
        id: true,
        type: true,
        week: true,
        order: true,
        title: true,
        quizId: true,
      },
    });
  } catch (error) {
    console.log("from getCourseLayoutData", error);
    throw new Error("Failed to load course data.");
  }
};

const getCourseProgressData = async (profileId, courseId) => {
  try {
    return await prisma.courseProgress.findMany({
      where: { profileId, courseId },
      select: {
        id: true,
        courseContnetId: true,
        //completed: true,
      },
    });
  } catch (error) {
    console.log("from getCourseDbData", error);
    throw new Error("Failed to load course data.");
  }
};

module.exports = { getCourseDb };
