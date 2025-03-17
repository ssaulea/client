export interface User {
    username: string;
    token: string;
    photoUrl?: string;
    gender: string;
    knownAs: string;
    roles: string[];
}