/**
 * Middleware para verificar que el usuario autenticado sea admin
 */
export const isAdmin = (req, res, next) => {
    try {
        // El middleware authMiddleware ya debe haber ejecutado y agregado req.user
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        // Verificar si el usuario tiene rol de admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Acceso denegado. Se requieren permisos de administrador.'
            });
        }

        // Si es admin, continuar
        next();
    } catch (error) {
        console.error('Error en middleware de admin:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};
