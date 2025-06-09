export type Email = `${string}@${string}.${string}`;

export interface DBEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DBUser extends DBEntity {
    nema: string;
    email: Email;
    password: string;
}

export interface DBChat extends DBEntity {
    ownerID: DBUser["id"];
    name: string;
}


export type DBCreateUser = Pick<DBUser, "email" | "password" | "nema">;
export type DBCreateChat = Pick<DBChat, "name" | "ownerID">;
export type DBCreateMessage = Pick<DBMessage, "chatID" | "message" | "type">;