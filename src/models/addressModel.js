const connection = require('./connection');

const getAll = async () => {
    const [address] = await connection.execute('SELECT * FROM ADDRESS');
    return address;
};

const createAdress = async (adress) =>{
    const {userid, road, city, state, zipcode, country} = adress;
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO ADDRESS (USERID, ROAD, CITY, STATE, ZIPCODE, COUNTRY, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

    const [createAdress] = await connection.execute(query, [userid, road, city, state, zipcode, country, dateUTC]);

    return {insertId: createAdress.insertId};
}

const deleteAddress = async (id) => { 
    const removedAddress = await connection.execute('DELETE FROM ADDRESS WHERE ADDRESSID = ?', [id]);
    return removedAddress;
}

module.exports = {
    getAll,
    createAdress,
    deleteAddress
};