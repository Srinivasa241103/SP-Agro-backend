import passport from "passport";
import dotenv from "dotenv"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {UserRepository} from "../db/user.js"

dotenv.config({
    path: "../../.env",
});

const userRepo = new UserRepository();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:1010/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
              // Check if user exists
              console.log('Received user data from Google:', {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
              });
              
              //extract data from google response
              const googleId = profile.id;
              const email = profile.emails[0].value;
              const name = profile.displayName;
              const profilePicture = profile.photos[0]?.value || null;

              let user = await userRepo.findUserByGoogleId(googleId);
              if(user){
                return done(null, user);
              }

              user = await userRepo.findUserByEmail(email);
              if(user){
                user = await userRepo.linkGoogleAccount(user.id, googleId, profilePicture);
                return done(null, user);
              }

              // create a user if user not found
              user = await userRepo.createUser({
                email: email,
                name: name,
                google_id: googleId,
                profile_picture: profilePicture,
                is_verified: true
              });

              user.isNewUser = true;
              return done(null, user);

            } catch (error) {
              return done(error, null);
            }
          }
        )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
      const user = await userRepo.findUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

export default passport;

