const asyncHandler = require("express-async-handler");
const queries = require("./queries");

const mainDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userData = await queries.getMainDashboard(userId);
  if (!userData)
    return res.status(500).json({
      message:
        "Opps, the website is experiencing issues at the moment, please try again later",
    });

  return res.status(200).json(userData);
});

module.exports = { mainDashboardData };
