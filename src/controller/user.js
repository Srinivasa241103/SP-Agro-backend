import {UserService} from "../service/user.js";

const userService = new UserService();
export const registerUser = async (req, res) => {
    // Logic to register a user
    try{
        const {email, password, userName, phone} = req.body;

        if(!email || !password || !userName || !phone){
            return res.status(400).json({message: "All fields are required"});
        }
        const userObject= {
            userName,
            email,
            password,
            isVerified: false,
            phone,
            role: 'customer'
        }
        const isUserExists = await userService.checkUserIfUserExists(email, phone);
        if(isUserExists){
            return res.status(409).json({message: "User already exists please login"});
        }

        const userDetails = await userService.userSignup(userObject);
    } catch (err){
        console.error('Error registering user:', err);
        res.status(500).json({message: "Internal server error"});

    }

}