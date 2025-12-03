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

export type UpdateTravelerProfileInput = {
    name?: string;
    bio?: string;
    gender?: string;
    interests?: string[];
    location?: string;
    visitedCountries?: string[];
    profilePhoto?: string;
};
