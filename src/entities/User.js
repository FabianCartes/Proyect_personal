/**
 * definicion entidad `user`.
 * Esta tabla almacena la información esencial de los usuarios registrados en la
 * plataforma, como sus credenciales de inicio de sesión y datos de perfil.
 * Es quien crea reseñas y reacciona al contenido.
 */
import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    username: {
      type: "varchar",
      nullable: true, // por ahora 
    },
    role: {
      type: "enum",
      enum: ["user", "admin"],
      default: "user",
      nullable: false,
    },
    profilePictureUrl: {
      type: "varchar",
      nullable: true, // por ahora
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
  },
  relations: {
    reviews: {
      type: "one-to-many",
      target: "Review", // El nombre del "name" en la entidad Review
      inverseSide: "user", // El nombre del campo "user" en la entidad Review
    },
    reactions: {
      type: "one-to-many",
      target: "Review_Reaction",
      inverseSide: "user",
    },
    reports: {
      type: "one-to-many",
      target: "Review_Report",
      inverseSide: "user",
    },
    favoriteCars: {
      type: "one-to-many",
      target: "Favorite_Car",
      inverseSide: "user",
    },
  },
});