"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
// Middleware de validação do corpo da requisição
const validateBody = (request, response, next) => {
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
exports.validateBody = validateBody;
// Funções de validação individuais
const validateUserId = (userid) => {
    if (userid === undefined || userid <= 0) {
        return 'The "userid" field is required and must be greater than zero';
    }
    return null;
};
const validateRoad = (road) => {
    if (!road || road.trim() === '') {
        return 'The "road" field is required and cannot be empty';
    }
    return null;
};
const validateCity = (city) => {
    if (!city || city.trim() === '') {
        return 'The "city" field is required and cannot be empty';
    }
    return null;
};
const validateState = (state) => {
    if (!state || state.trim() === '') {
        return 'The "state" field is required and cannot be empty';
    }
    return null;
};
const validateZipcode = (zipcode) => {
    if (!zipcode || zipcode.trim() === '') {
        return 'The "zipcode" field is required and cannot be empty';
    }
    return null;
};
const validateCountry = (country) => {
    if (!country || country.trim() === '') {
        return 'The "country" field is required and cannot be empty';
    }
    return null;
};
