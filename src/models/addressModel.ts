import { Connection } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

interface Address {
    userid: number;
    road: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
}

interface InsertAddressResult {
    insertId: number;
}

// Supondo que você tenha uma configuração de conexão exportada
import connection from './connection';

// Função para obter todos os endereços
const getAll = async (): Promise<RowDataPacket[]> => {
    const [address] = await connection.execute<RowDataPacket[]>('SELECT * FROM ADDRESS');
    return address;
};

// Função para criar um novo endereço
const createAddress = async (address: Address): Promise<InsertAddressResult> => {
    const { userid, road, city, state, zipcode, country } = address;
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO ADDRESS (USERID, ROAD, CITY, STATE, ZIPCODE, COUNTRY, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

    // Execute a consulta
    const [result] = await connection.execute<any>(query, [userid, road, city, state, zipcode, country, dateUTC]);

    // Verificar e extrair insertId do resultado
    if ('insertId' in result) {
        return { insertId: (result as any).insertId };
    } else {
        throw new Error('Failed to retrieve insertId from result');
    }
};
// Função para deletar um endereço
const deleteAddress = async (id: number): Promise<void> => { 
    await connection.execute('DELETE FROM ADDRESS WHERE ADDRESSID = ?', [id]);
};

// Função para atualizar um endereço
const updateAddress = async (id: number, address: Partial<Address>): Promise<void> => { 
    const { road, city, state, zipcode, country } = address;
    const query = 'UPDATE ADDRESS SET ROAD = ?, CITY = ?, STATE = ?, ZIPCODE = ?, COUNTRY = ? WHERE ADDRESSID = ?';

    await connection.execute(query, [road, city, state, zipcode, country, id ]);
};

export {
    getAll,
    createAddress,
    deleteAddress,
    updateAddress
};
