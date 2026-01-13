/**
 * definicion entidad `Review` (reseña)
 * conecta a un `User` con un `Car`
 * y almacena sus opiniones (comentarios positivos, negativos, neutros)
 * es la entidad principal a la que se asocian las reacciones, denuncias y
 * etiquetas de fallas.
 */
import { EntitySchema } from "typeorm";

export const Review = new EntitySchema({
  name: "Review",
  tableName: "reviews",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    positiveComment: {
      type: "text",
      nullable: true,
    },
    negativeComment: {
      type: "text",
      nullable: true,
    },
    recommendation: {
      type: "text",
      nullable: true,
    },
    specificVersion: {
      type: "varchar",
      nullable: true,
    },
    type: { // POSITIVO, NEGATIVO, NEUTRAL
      type: "varchar",
      length: 50,
      nullable: false,
    },
    rating: {
      type: "int",
      nullable: true,
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
    //claves foraneas
    user_id: {
      type: "int",
    },
    car_id: {
      type: "int",
    }
  },
  relations: {
    //pertenece a un usuario
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
    },
    //pertenece a un auto
    car: {
      type: "many-to-one",
      target: "Car",
      joinColumn: { name: "car_id" },
      onDelete: "CASCADE",
    },
    //tiene muchas reacciones
    reactions: {
      type: "one-to-many",
      target: "Review_Reaction",
      inverseSide: "review",
    },
    //tiene muchas denuncias
    reports: {
      type: "one-to-many",
      target: "Review_Report",
      inverseSide: "review",
    },
    //tiene muchas etiquetas de falla
    failureTags: {
      type: "many-to-many",
      target: "FailureTag",
      cascade: true,
      joinTable: {
        name: "review_failure_tags",
        joinColumn: { name: "review_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
      },
    },
    //tiene muchas fotos
    photos: {
      type: "one-to-many",
      target: "Photo",
      inverseSide: "review",
    },
  },
});