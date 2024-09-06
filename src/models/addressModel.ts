import { Connection } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { AddressModel} from '../interfaces/AddressModel.interface'


interface InsertAddressResult {
    insertId: number;
}

import connection from './connection';

// Function to get all addresses
const getAll = async (): Promise<RowDataPacket[]> => {
    const [address] = await connection.execute<RowDataPacket[]>('SELECT * FROM ADDRESS');
    return address;
};

// Function to create a new address
const createAddress = async (address: AddressModel): Promise<InsertAddressResult> => {
    const { userid, road, city, state, zipcode, country } = address;
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO ADDRESS (USERID, ROAD, CITY, STATE, ZIPCODE, COUNTRY, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

    // Run the query
    const [result] = await connection.execute<any>(query, [userid, road, city, state, zipcode, country, dateUTC]);

    // Check and extract insertId from result
    if ('insertId' in result) {
        return { insertId: (result as any).insertId };
    } else {
        throw new Error('Failed to retrieve insertId from result');
    }
};
// Function to delete an address
const deleteAddress = async (id: number): Promise<void> => { 
    await connection.execute('DELETE FROM ADDRESS WHERE ADDRESSID = ?', [id]);
};

// Function to update an address
const updateAddress = async (id: number, address: Partial<AddressModel>): Promise<void> => { 
    const { road, city, state, zipcode, country } = address;
    const query = 'UPDATE ADDRESS SET ROAD = ?, CITY = ?, STATE = ?, ZIPCODE = ?, COUNTRY = ? WHERE ADDRESSID = ?';

    await connection.execute(query, [road, city, state, zipcode, country, id ]);
};

// Get addresses by country
export const getAddressesByCountry = async (country: string): Promise<RowDataPacket[]> => {
    const [addresses] = await connection.execute<RowDataPacket[]>('SELECT * FROM ADDRESS WHERE country = ?', [country]);
    return addresses;
  };
  
  // Get all addresses
  export const getAllAddresses = async (): Promise<RowDataPacket[]> => {
    const [addresses] = await connection.execute<RowDataPacket[]>('SELECT * FROM ADDRESS');
    return addresses;
  };
  
  // Get address by ID
  export const getAddressById = async (id: string): Promise<RowDataPacket | null> => {
    const [addresses] = await connection.execute<RowDataPacket[]>('SELECT * FROM ADDRESS WHERE ADDRESSID = ?', [id]);
    return addresses.length > 0 ? addresses[0] : null;
  };

export {
    getAll,
    createAddress,
    deleteAddress,
    updateAddress
};
