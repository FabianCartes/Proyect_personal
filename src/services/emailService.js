import nodemailer from 'nodemailer';
import { envs } from '../config/configEnv.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: envs.emailUser,
                pass: envs.emailPass
            }
        });
    }

    async sendWelcomeEmail(email, username) {
        try {
            const mailOptions = {
                from: `"OpiCar" <${envs.emailUser}>`,
                to: email,
                subject: '¡Bienvenido a OpiCar!',
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #f8fafc;">
                        <div style="background-color: #dc2626; padding: 32px 20px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">¡Bienvenido a OpiCar!</h1>
                        </div>
                        <div style="padding: 32px 24px; background-color: white;">
                            <h2 style="color: #1e293b; font-size: 22px; margin-top: 0;">Hola ${username},</h2>
                            <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px;">Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros en este viaje.</p>
                            
                            <h3 style="color: #dc2626; font-size: 18px; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #fee2e2; padding-bottom: 8px; display: inline-block;">Lo que ofrece OpiCar</h3>
                            
                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                                <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; line-height: 1.8;">
                                    <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                                        <span style="color: #dc2626; font-weight: bold; margin-right: 12px; font-size: 18px;">&bull;</span>
                                        <span><strong>Catálogo exahustivo:</strong> Accede a especificaciones detalladas de una amplia variedad de modelos.</span>
                                    </li>
                                    <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                                        <span style="color: #dc2626; font-weight: bold; margin-right: 12px; font-size: 18px;">&bull;</span>
                                        <span><strong>Reseñas reales:</strong> Lee experiencias auténticas de otros conductores para tomar mejores decisiones.</span>
                                    </li>
                                    <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                                        <span style="color: #dc2626; font-weight: bold; margin-right: 12px; font-size: 18px;">&bull;</span>
                                        <span><strong>Comunidad activa:</strong> Reporta fallas comunes y ayuda a crear una base de conocimiento confiable.</span>
                                    </li>
                                </ul>
                            </div>

                            <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; font-style: italic; background-color: #fff1f2; padding: 16px; border-left: 4px solid #dc2626; border-radius: 4px;">
                                "Tu opinión es el motor que nos impulsa. Estamos siempre atentos a tus comentarios y recomendaciones para mejorar la plataforma día a día."
                            </p>

                            <div style="margin-top: 32px; text-align: center;">
                                <a href="${envs.appHost || 'http://localhost:5173'}" style="background-color: #dc2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3); transition: background-color 0.2s;">Explorar OpiCar &rarr;</a>
                            </div>
                        </div>
                        <div style="background-color: #1e293b; padding: 24px; text-align: center; color: #94a3b8; font-size: 13px;">
                            <p style="margin-bottom: 8px;">Conduce seguro, infórmate mejor.</p>
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} OpiCar. Todos los derechos reservados.</p>
                        </div>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log("Correo de bienvenida enviado a: ", email, info.messageId);
            return true;
        } catch (error) {
            console.error("Error al enviar correo de bienvenida:", error);
            // No lanzamos error para no interrumpir el registro si falla el correo
            return false;
        }
    }
}

export const emailService = new EmailService();
