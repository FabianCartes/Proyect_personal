/**
 * definicion entidad `Review_Report` (denuncia de reseña).
 * almacena las denuncias que los usuarios envian sobre reseñas
 * inapropiadas o spam. Sirve como un registro de moderacion, guardando quién
 * reporto, por que, y el estado (pendiente, resuelta, rechazada).
 */
import { EntitySchema } from "typeorm";

export const Review_Report = new EntitySchema({
  name: "Review_Report",
  tableName: "review_reports",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    reason: { // spam, odio, ofensivo, etc.
      type: "varchar",
      nullable: false,
    },
    details: {
      type: "text",
      nullable: true,
    },
    status: { // pendiente, resolvido, rechazado
      type: "varchar",
      default: "PENDING",
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
    //clave foraneas
    user_id: {
      type: "int",
    },
    review_id: {
      type: "int",
    },
  },
  relations: {
    //usuario que reporta
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE", 
    },
    //reseña reportada
    review: {
      type: "many-to-one",
      target: "Review",
      joinColumn: { name: "review_id" },
      onDelete: "CASCADE",
    },
  },
});