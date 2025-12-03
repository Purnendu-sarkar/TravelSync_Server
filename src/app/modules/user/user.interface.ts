export type CreateTravelerInput = {
    password: string;
    traveler: {
        name: string;
        email: string;
        bio?: string;
        gender?: string;
        interests?: string[];
        location?: string;
        visitedCountries?: string[];
        profilePhoto?: string;
    };
};
