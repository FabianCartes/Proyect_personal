/**
 * definicion entidad `Review_Reaction`.
 * registra las interacciones de like y dislike que los
 * usuarios dan a las reseñas. Utiliza un índice unico para asegurar que un `User`
 * solo pueda reaccionar una vez a un `Review` especifico.
 */
import { EntitySchema } from "typeorm";

export const Review_Reaction = new EntitySchema({
  name: "Review_Reaction",
  tableName: "review_reactions",
  indices: [
    {
      name: "USER_REVIEW_REACTION_UNIQUE",
      columns: ["user_id", "review_id"], //restriccion para que sea unica
      unique: true,
    },
  ],
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    reactionType: { // LIKE, DISLIKE
      type: "varchar",
      length: 50,
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
    //claves foraneas
    user_id: {
      type: "int",
    },
    review_id: {
      type: "int",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
    },
    review: {
      type: "many-to-one",
      target: "Review",
      joinColumn: { name: "review_id" },
      onDelete: "CASCADE",
    },
  },
});