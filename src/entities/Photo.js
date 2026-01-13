/**
 * definicion entidad `Photo`.
 * almacena las URLs de las imágenes que componen la galería de un
 * vehículo. Cada registro está vinculado a un `Car` para permitir
 * múltiples fotos por auto
 */
import { EntitySchema } from "typeorm";

export const Photo = new EntitySchema({
  name: "Photo",
  tableName: "photos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    url: {
      type: "varchar",
      nullable: false,
    },
    caption: {
      type: "varchar",
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
    car_id: {
      type: "int",
      nullable: true,
    },
    review_id: {
      type: "int",
      nullable: true,
    }
  },
  relations: { //cada foto es de un auto o de una reseña
    car: {
      type: "many-to-one",
      target: "Car",
      joinColumn: {
        name: "car_id",
      },
      onDelete: "CASCADE",
    },
    review: {
      type: "many-to-one",
      target: "Review",
      joinColumn: {
        name: "review_id",
      },
      onDelete: "CASCADE",
    },
  },
});