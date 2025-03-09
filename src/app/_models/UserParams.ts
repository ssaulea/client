import { User } from "./user";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 100;
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastActive';

    constructor(user: User | null) {
        if (!user) {
            const userString = localStorage.getItem('user');
            if (userString)
                user = JSON.parse(userString);
        }
        this.gender = user?.gender === 'male' ? 'female' : 'male';
    }
}