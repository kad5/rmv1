const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AppleStrategy = require("passport-apple").Strategy;
const TwitterStrategy =
  require("@superfaceai/passport-twitter-oauth2").Strategy;

const queries = require("../auth/queries");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const providerId = profile.id;
        const email = profile.emails[0]?.value || null;
        const name = profile.displayName || null;

        let user = await queries.getUserByProvider("google", providerId);

        if (!user) {
          // check for email conflicts {someone already registerd with that same email the social uses}
          if (email) {
            const existingUser = await queries.getUserByEmail(email);
            if (existingUser) {
              const updatedUser = await queries.updateUserProvider(
                "google",
                providerId,
                existingUser.id
              );
              return done(null, updatedUser);
            }
          }
          user = await queries.createNewSocialUser(
            "google",
            providerId,
            email,
            name
          );
        }
        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      callbackURL: "/auth/apple/callback",
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY, // Private key as a string Alternatively: privateKeyLocation: "./path/to/AuthKey.p8"
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, idToken, profile, done) {
      try {
        const decodedToken = jwt.decode(idToken, { json: true }); // Decode the idToken to extract payload
        if (!decodedToken) {
          return done(new Error("Invalid idToken"));
        }
        const { sub, email, email_verified } = decodedToken; // Extract user data from token, sub = providerId

        // Handle first-time user data from req.query.user (name only sent 1st time)
        let firstTimeUser;
        if (req.query && req.query.user && typeof req.query.user === "string") {
          try {
            firstTimeUser = JSON.parse(req.query.user); // { firstName, lastName }
          } catch (parseErr) {
            console.error("Failed to parse req.query.user:", parseErr);
          }
        }
        let user = await queries.getUserByProvider("apple", sub);

        // If no user exists, handle registration
        if (!user) {
          let name = null;
          let userEmail = email || null;
          if (userEmail) {
            const existingUser = await queries.getUserByEmail(email);
            if (existingUser) {
              const updatedUser = await queries.updateUserProvider(
                "apple",
                sub,
                existingUser.id
              );
              return done(null, updatedUser);
            }
          }
          if (firstTimeUser) {
            name = `${firstTimeUser.firstName || ""} ${
              firstTimeUser.lastName || ""
            }`.trim();
          }
          user = await queries.createNewSocialUser(
            "apple",
            sub,
            userEmail,
            name
          );
        }

        return done(null, user);
      } catch (error) {
        console.error("Apple Authentication Error:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID, // From Twitter Developer Portal
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: "/auth/twitter/callback",
      clientType: "confidential",
      scope: ["email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const providerId = profile.id;
        const name = profile.displayName || null;
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        let user = await queries.getUserByProvider("twitter", providerId);

        if (!user) {
          if (email) {
            const existingUser = await queries.getUserByEmail(email);
            if (existingUser) {
              const updatedUser = await queries.updateUserProvider(
                "twitter",
                providerId,
                existingUser.id
              );
              return done(null, updatedUser);
            }
          }
          user = await queries.createNewSocialUser(
            "twitter",
            providerId,
            email,
            name
          );
        }

        return done(null, user);
      } catch (error) {
        console.error("Twitter Strategy Error:", error);
        return done(error);
      }
    }
  )
);

module.exports = passport;
