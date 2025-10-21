import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data: null,
            });
        }

        const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

        const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
            expiresIn: "1h",
        });

            return res.status(200).json({
                success: true,
                message: "Login successfully",
                data: {
                    access_token: token,
                },
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};
export const registerController= async (req: Request, res: Response) => {
    const {username, email, password} = req.body;

    try {
        if (!email || !password) {  
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data: null 
            });       
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser.id,
                email: newUser.email,
                createdAt: newUser.createdAt,
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
}
    
export const meController = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";

        let payload: any;
        try {
            payload = jwt.verify(token, jwtSecret) as any;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const userId = payload.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get me successfully",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
    