"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meController = exports.registerController = exports.loginController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data: null,
            });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, jwtSecret, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                access_token: token,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};
exports.loginController = loginController;
const registerController = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data: null
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};
exports.registerController = registerController;
const meController = async (req, res) => {
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
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        catch (err) {
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
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.meController = meController;
//# sourceMappingURL=authController.js.map