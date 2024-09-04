const validateBody = (request,response, next) => {
    const { userid, road, city, state, zipcode, country } = request.body;

    const userIdError = validateUserId(userid);
    if (userIdError) {
        return response.status(400).json({ message: userIdError });
    }

    const roadError = validateRoad(road);
    if (roadError) {
        return response.status(400).json({ message: roadError });
    }

    const cityError = validateCity(city);
    if (cityError) {
        return response.status(400).json({ message: cityError });
    }

    const stateError = validateState(state);
    if (stateError) {
        return response.status(400).json({ message: stateError });
    }

    const zipcodeError = validateZipcode(zipcode);
    if (zipcodeError) {
        return response.status(400).json({ message: zipcodeError });
    }

    const countryError = validateCountry(country);
    if(country){
        return response.status(400).json({message: countryError })
    }

    next();
};

const validateUserId = (userid) => {
    if (userid === undefined || userid <= 0) {
        return 'The "userid" field is required and cannot be empty';
    }
    return null;
};

const validateRoad = (road) => {
    if (road === undefined || road.trim() === '') {
        return 'The "road" field is required and cannot be empty';
    }
    return null;
};

const validateCity = (city) => {
    if (city === undefined || city.trim() === '') {
        return 'The "city" field is required and cannot be empty';
    }
    return null;
};

const validateState = (state) => {
    if (state === undefined || state.trim() === '') {
        return 'The "state" field is required and cannot be empty';
    }
    return null;
};

const validateZipcode = (zipcode) => {
    if (zipcode === undefined || zipcode.trim() === '') {
        return 'The "zipcode" field is required and cannot be empty';
    }
    return null;
};

const validateCountry = (country) => {
    if (country === undefined || country.trim() === '') {
        return 'The "country" field is required and cannot be empty';
    }
    return null;
};

module.exports = {
    validateBody,
}