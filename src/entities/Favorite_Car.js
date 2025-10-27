/**
 * definicion entidad `Favorite_Car`.
 * actúa como un puente (muchos a muchos) para registrar que usuarios han marcado que autos como favoritos.
 */
import { EntitySchema } from "typeorm";

export const Favorite_Car = new EntitySchema({
  name: "Favorite_Car",
  tableName: "favorite_cars",
  indices: [
    {
      name: "USER_CAR_FAVORITE_UNIQUE",
      columns: ["user_id", "car_id"], //asegura que un auto pueda ser guardado por un usuario 1 vez
      unique: true,
    },
  ],
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    //claves foraneas
    user_id: {
      type: "int",
    },
    car_id: {
      type: "int",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE", // si se borra el usuario, se borra su favorito
    },
    car: {
      type: "many-to-one",
      target: "Car",
      joinColumn: { name: "car_id" },
      onDelete: "CASCADE", // si se borra el auto, se borra de los favoritos
    },
  },
});