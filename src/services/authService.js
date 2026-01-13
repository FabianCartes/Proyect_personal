import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envs } from "../config/configEnv.js";
import { UserService } from "./userService.js";
import { emailService } from "./emailService.js";

export class AuthService {
    constructor() {
        this.userService = new UserService();
    }

    async register(userData) {
        const existingUser = await this.userService.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("El usuario ya existe");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.userService.create({
            ...userData,
            password: hashedPassword,
        });

        await emailService.sendWelcomeEmail(newUser.email, newUser.username);

        const token = this.generateToken(newUser);
        return { user: newUser, token };
    }

    async login(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Credenciales inválidas");
        }

        const token = this.generateToken(user);
        return { user, token };
    }

    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            envs.jwtSecret || "secret",
            {
                expiresIn: "24h",
            }
        );
    }
}
