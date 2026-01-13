/**
 * definicion entidad `Car`.
 * Almacena toda la información descriptiva y técnica de un vehículo específico (marca, modelo,
 * año, especificaciones en JSON, etc.).
 */
import { EntitySchema } from "typeorm";

export const Car = new EntitySchema({
  name: "Car",
  tableName: "cars",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    make: { // "Marca"
      type: "varchar",
      nullable: false,
    },
    model: { // "Modelo"
      type: "varchar",
      nullable: false,
    },
    year: {
      type: "int",
      nullable: false,
    },
    version: {
      type: "varchar",
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    specs: {
      type: "jsonb", // 'jsonb' para guardar objetos en pg
      nullable: true,
    },
    versions: {
      type: "jsonb", // Array de versiones: [{ name: "GLX", specs: {...} }]
      nullable: true,
    },
    mainImageUrl: {
      type: "varchar",
      nullable: true,
    },
    chileautosUrl: {
      type: "varchar",
      nullable: true,
    },
    marketplaceUrl: {
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
  },
  relations: {
    photos: {
      type: "one-to-many",
      target: "Photo",
      inverseSide: "car",
    },
    reviews: {
      type: "one-to-many",
      target: "Review",
      inverseSide: "car",
    },
    favoritedBy: {
      type: "one-to-many",
      target: "Favorite_Car",
      inverseSide: "car",
    },
    createdBy: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: true,
      eager: false,
    },
  },
});