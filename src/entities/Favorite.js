import { EntitySchema } from "typeorm";

export const Favorite = new EntitySchema({
    name: "Favorite",
    tableName: "favorites",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment",
        },
        user_id: {
            type: "int",
            nullable: false,
        },
        car_id: {
            type: "int",
            nullable: false,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "user_id",
            },
            onDelete: "CASCADE",
        },
        car: {
            type: "many-to-one",
            target: "Car",
            joinColumn: {
                name: "car_id",
            },
            onDelete: "CASCADE",
        },
    },
    uniques: [
        {
            name: "unique_user_car",
            columns: ["user_id", "car_id"],
        },
    ],
});
