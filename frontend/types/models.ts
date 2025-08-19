export interface User {
    _id: string;
    name: string;
    email: string;
    familyGroup?: Group;
}

export interface Group {
    _id: string;
    name: string;
    members: User[];
    joinCode: string;
    creator: User;
}

export interface Item {
    _id: string;
    name: string;
    description?: string;
    ownerId: User;
    groupId?: Group;
    forFamily?: boolean;
}