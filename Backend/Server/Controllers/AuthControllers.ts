import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

//Controllers For User Registration

export const registerUser = async (req: Request, res: Response) => {
        try{
            const {name, email, password} = req.body;

            //find user by email

            const user =await User.findOne({email});

            if(user){
                return res.status(400).json({message: "User already exists"});
            }

            //Encrpt Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);


            //Create new User
            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });

            await newUser.save();

            //setting user data in session
            req.session.isLoggedIn = true;
            req.session.userId = newUser._id;
            return res.json({
                message: "User registered successfully",
                user:{
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    
                }
            })
        } catch (error:any) {
            console.log(error);
            res.status(500).json({message: error.message});
        }

}

//Controllers For User Login

export const loginUser = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
         //find user by email

            const user =await User.findOne({email});

            if(!user){
                return res.status(400).json({message: "invalid email or password"});
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if(!isPasswordMatch){
                return res.status(400).json({message: "invalid email or password"});
            }

            //setting user data in session
            req.session.isLoggedIn = true;
            req.session.userId = user._id;
            return res.json({
                message: "User logged in successfully",
                user:{
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                   
                }
            })
        } 
        catch(error) {
            console.log(error);
            res.status(500).json({message: "error.message"});
        }

}

//Controllers For User Logout
export const logoutUser = (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ message: "Logout successful" });
    });
};
        
//Controllers for User verify
export const verifyUser = async (req: Request, res: Response) => {
 
    try{
            const {userId} = req.session;
            const user = await User.findById(userId).select("-password");

            if(!user){
                return res.status(404).json({message: "User not found"});
            }
            return res.json({message: "User verified successfully", user});
    } 
    catch(error:any) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
