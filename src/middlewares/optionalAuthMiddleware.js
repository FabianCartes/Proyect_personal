import jwt from "jsonwebtoken";
import { envs } from "../config/configEnv.js";

export const optionalAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, envs.jwtSecret || "secret");
        req.user = decoded;
    } catch (error) {
        // Si el token es inválido, simplemente continuamos sin usuario autenticado
        // No bloqueamos el acceso porque es opcional
        console.log("Token inválido en optionalAuthMiddleware:", error.message);
    }

    next();
};
