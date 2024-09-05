const bcrypt = require('bcrypt');
const connection = require('./connection');

const getAll = async (email) => { 
    const query = 'SELECT U.NAME, U.EMAIL, A.ROAD, A.CITY, A.STATE, A.ZIPCODE, A.COUNTRY FROM USER U INNER JOIN ADDRESS A ON U.USERID = A.USERID WHERE EMAIL = ? ';
    const [rows] = await connection.execute(query, [email]);

    const groupedData = rows.reduce((acc, row) => {
        if (!acc[row.USERID]) {
            acc[row.USERID] = {
                USERID: row.USERID,
                NAME: row.NAME,
                EMAIL: row.EMAIL,
                ADDRESSES: []
            };
        }

        acc[row.USERID].ADDRESSES.push({
            ROAD: row.ROAD,
            CITY: row.CITY,
            STATE: row.STATE,
            ZIPCODE: row.ZIPCODE,
            COUNTRY: row.COUNTRY
        });

        return acc;
    }, {});

    const resultArray = Object.values(groupedData);

    return resultArray;
};

const createUser = async ({ name, email, password }) => {
    const createdAt = new Date().toISOString();
    const query = `
        INSERT INTO USER (NAME, EMAIL, PASSWORD, created_at) 
        VALUES (?, ?, ?, ?)`;
    if (!password) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const [result] = await connection.execute(query, [name, email, hash, createdAt]);
    return { insertId: result.insertId };
};

const deleteUser = async (id) => { 
    const [removedUser] = await connection.execute('DELETE FROM USER WHERE USERID = ?', [id]);
    return removedUser;
}

const updateUser = async (id, user) => { 
    const {name, email} = user;
    const query = 'UPDATE USER SET NAME = ?, EMAIL = ? WHERE USERID = ?';
    const updatedUser = await connection.execute(query, [name, email, id]);
    return updatedUser;
}

const getUserByEmail = async (email) => {
    const query = 'SELECT NAME, EMAIL, PASSWORD FROM USER WHERE EMAIL = ?';
    const [users] = await connection.execute(query, [email]);
    return users[0];
};

const verifyPassword = async (email, password) => {
    const user = await getUserByEmail(email);
   
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    
    if (!isMatch) {
        return { success: false, message: 'Incorrect password' };
    }

    return { success: true, message: 'Correct password', user };
};

module.exports = {
    getAll,
    createUser,
    deleteUser,
    updateUser,
    getUserByEmail,
    verifyPassword
};