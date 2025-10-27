/**
 * definicion entidad `Feedback`.
 * almacena todas las sugerencias, reportes de bugs o
 * comentarios generales que los usuarios envian sobre el
 * funcionamiento de la plataforma para la mejora continua del sitio.
 */
import { EntitySchema } from "typeorm";

export const Feedback = new EntitySchema({
  name: "Feedback",
  tableName: "feedback",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    // SUGGESTION para (Sugerencia) o BUG_REPORT para (reporte problema)
    type: {
      type: "varchar",
      nullable: false,
    },
    subject: { // asunto
      type: "varchar",
      nullable: false,
    },
    message: { // mensaje detallado
      type: "text",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    //clave foranea (por ahora)
    user_id: {
      type: "int",
      nullable: true,// para capturar feedback de usuarios visitantes (no registrados)
    },
  },
  relations: {
    // quien envio el feedback
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      onDelete: "SET NULL", //si el usuario desaparece, el feedback no
    },
  },
});