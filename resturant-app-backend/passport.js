const googleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
const User = require("./models/user");

const GOOGLE_CALLBACK_URL = "https://restaurant-booking-system-p6kp.onrender.com/auth/google/callback";

passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, callback) {
      try {
        const defaultUser = {
          id: uuidv4(),
          fullName: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value,
          googleId: profile.id,
          role: "customer",
          lastLoginAt: new Date().toISOString(),
        };

        const [user, created] = await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: defaultUser,
        });

        // Update last login time for existing users
        if (!created) {
          await user.update({ lastLoginAt: new Date().toISOString() });
        }

        return callback(null, user);
      } catch (err) {
        console.log("Error during authentication:", err);
        return callback(err, null);
      }
    }
  )
);

// These are still needed for session-based auth, but won't be used with JWT
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
