import {UserRepository} from "../db/user.js";
import {generateTemporaryToken} from "../utils/jwt.js";

export class UserService{
    constructor() {
        this.userRepo = new UserRepository();
    }

    async  checkUserIfUserExists(email, phone) {
        const userExists = await this.userRepo.checkUserExistsByEmail(email);
        return !!userExists;
    }

    async userSignup(userDetails){
        let {userName, email, password, isVerified, phone, role} = userObject;
        const {unHashedToken, hashedToken, tokenExpiry} = generateTemporaryToken();
        

    }
}