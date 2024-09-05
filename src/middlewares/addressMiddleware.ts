import { Request, Response, NextFunction } from 'express';
import { AddressRequestBody } from '../interfaces/AddressRequestBody.interface'

const validateBody = (request: Request<{}, {}, AddressRequestBody>, response: Response, next: NextFunction): void => {
    const { userid, road, city, state, zipcode, country } = request.body;

    const userIdError = validateUserId(userid);
    if (userIdError) {
        response.status(400).json({ message: userIdError });
    }

    const roadError = validateRoad(road);
    if (roadError) {
        response.status(400).json({ message: roadError });
    }

    const cityError = validateCity(city);
    if (cityError) {
        response.status(400).json({ message: cityError });
    }

    const stateError = validateState(state);
    if (stateError) {
        response.status(400).json({ message: stateError });
    }

    const zipcodeError = validateZipcode(zipcode);
    if (zipcodeError) {
        response.status(400).json({ message: zipcodeError });
    }

    const countryError = validateCountry(country);
    if (countryError) {
        response.status(400).json({ message: countryError });
    }

    next();
};

const validateUserId = (userid?: number): string | null => {
    if (userid === undefined || userid <= 0) {
        return 'The "userid" field is required and must be greater than zero';
    }
    return null;
};

const validateRoad = (road?: string): string | null => {
    if (!road || road.trim() === '') {
        return 'The "road" field is required and cannot be empty';
    }
    return null;
};

const validateCity = (city?: string): string | null => {
    if (!city || city.trim() === '') {
        return 'The "city" field is required and cannot be empty';
    }
    return null;
};

const validateState = (state?: string): string | null => {
    if (!state || state.trim() === '') {
        return 'The "state" field is required and cannot be empty';
    }
    return null;
};

const validateZipcode = (zipcode?: string): string | null => {
    if (!zipcode || zipcode.trim() === '') {
        return 'The "zipcode" field is required and cannot be empty';
    }
    return null;
};

const validateCountry = (country?: string): string | null => {
    if (!country || country.trim() === '') {
        return 'The "country" field is required and cannot be empty';
    }
    return null;
};

export { validateBody };
