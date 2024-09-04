const validateBody = (request,response, next) => {
    const { name, email } = request.body;

    const nameError = validateName(name);
    if (nameError) {
        return response.status(400).json({ message: nameError });
    }

    const emailError = validateEmail(email);
    if (emailError) {
        return response.status(400).json({ message: emailError });
    }

    next();
};


const validateName = (name) => {
    if (name === undefined || name.trim() === '') {
        return 'The "name" field is required and cannot be empty';
    }
    return null;
};

const validateEmail = (email) => {
    if (email === undefined || email.trim() === '') {
        return 'The "email" field is required and cannot be empty';
    }
    return null;
};

module.exports = {
    validateBody,
}