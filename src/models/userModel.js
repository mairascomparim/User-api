const connection = require('./connection');

const getAll = async () => {
    const query = 'SELECT * FROM USER';
    const [users] = await connection.execute(query);
    return users;
};

const createUser = async ({ name, email }) => {
    const createdAt = new Date().toISOString();
    const query = `
        INSERT INTO USER (NAME, EMAIL, created_at) 
        VALUES (?, ?, ?)`;
    const [result] = await connection.execute(query, [name, email, createdAt]);
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

module.exports = {
    getAll,
    createUser,
    deleteUser,
    updateUser
};