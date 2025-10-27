/**
 * definicion entidad `FailureTag` (Etiqueta de Falla).
 * actua como un diccionario de fallas comunes predefinidas
 * (ej: falla de transmision, problema electrico, etc). Los usuarios etiquetan
 * sus reseñas con estos tags para poder calcular las fallas más comunes
 * de forma eficiente.
 */
import { EntitySchema } from "typeorm";

export const FailureTag = new EntitySchema({
  name: "FailureTag",
  tableName: "failure_tags",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    name: { //nombre etiquetas fallas
      type: "varchar",
      unique: true,
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
  },
  relations: {
    //relacion con muchas reseñas
    reviews: {
      type: "many-to-many",
      target: "Review",
      mappedBy: "failureTags",
    },
  },
});