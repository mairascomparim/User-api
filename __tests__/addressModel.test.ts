import { getAll, createAddress, deleteAddress, updateAddress, getAddressesByCountry, getAddressById } from '../src/models/addressModel';
import connection from '../src/models/connection'; 

// Mock da conexão
jest.mock('../src/models/connection');

describe('Address Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all addresses', async () => {
            const mockAddresses = [{ ADDRESSID: 1, ROAD: '123 Street', CITY: 'CityName' }];
            (connection.execute as jest.Mock).mockResolvedValue([mockAddresses]);

            const result = await getAll();

            expect(connection.execute).toHaveBeenCalledWith('SELECT * FROM ADDRESS');
            expect(result).toEqual(mockAddresses);
        });
    });

    describe('createAddress', () => {
        it('should insert a new address and return insertId', async () => {
            const mockInsertResult = { insertId: 1 };
            (connection.execute as jest.Mock).mockResolvedValue([mockInsertResult]);

            const newAddress = {
                userid: 1,
                road: '123 Street',
                city: 'CityName',
                state: 'StateName',
                zipcode: '12345',
                country: 'CountryName'
            };

            const result = await createAddress(newAddress);

            expect(connection.execute).toHaveBeenCalledWith(
                'INSERT INTO ADDRESS (USERID, ROAD, CITY, STATE, ZIPCODE, COUNTRY, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [newAddress.userid, newAddress.road, newAddress.city, newAddress.state, newAddress.zipcode, newAddress.country, expect.any(String)]
            );
            expect(result).toEqual({ insertId: 1 });
        });

        it('should throw an error if insertId is not returned', async () => {
            (connection.execute as jest.Mock).mockResolvedValue([{}]);

            const newAddress = {
                userid: 1,
                road: '123 Street',
                city: 'CityName',
                state: 'StateName',
                zipcode: '12345',
                country: 'CountryName'
            };

            await expect(createAddress(newAddress)).rejects.toThrow('Failed to retrieve insertId from result');
        });
    });

    describe('deleteAddress', () => {
        it('should delete an address by ID', async () => {
            (connection.execute as jest.Mock).mockResolvedValue([]);

            const addressId = 1;
            await deleteAddress(addressId);

            expect(connection.execute).toHaveBeenCalledWith('DELETE FROM ADDRESS WHERE ADDRESSID = ?', [addressId]);
        });
    });

    describe('updateAddress', () => {
        it('should update an address by ID', async () => {
            (connection.execute as jest.Mock).mockResolvedValue([]);

            const addressId = 1;
            const updatedAddress = {
                road: '456 New Street',
                city: 'NewCity',
                state: 'NewState',
                zipcode: '67890',
                country: 'NewCountry'
            };

            await updateAddress(addressId, updatedAddress);

            expect(connection.execute).toHaveBeenCalledWith(
                'UPDATE ADDRESS SET ROAD = ?, CITY = ?, STATE = ?, ZIPCODE = ?, COUNTRY = ? WHERE ADDRESSID = ?',
                [updatedAddress.road, updatedAddress.city, updatedAddress.state, updatedAddress.zipcode, updatedAddress.country, addressId]
            );
        });
    });

    describe('getAddressesByCountry', () => {
        it('should return addresses by country', async () => {
            const mockAddresses = [{ ADDRESSID: 1, COUNTRY: 'BR' }];
            (connection.execute as jest.Mock).mockResolvedValue([mockAddresses]);

            const country = 'BR';
            const result = await getAddressesByCountry(country);

            expect(connection.execute).toHaveBeenCalledWith('SELECT * FROM ADDRESS WHERE country = ?', [country]);
            expect(result).toEqual(mockAddresses);
        });
    });

    describe('getAddressById', () => {
        it('should return an address by ID', async () => {
            const mockAddress = [{ ADDRESSID: 1, ROAD: '123 Street' }];
            (connection.execute as jest.Mock).mockResolvedValue([mockAddress]);

            const addressId = '1';
            const result = await getAddressById(addressId);

            expect(connection.execute).toHaveBeenCalledWith('SELECT * FROM ADDRESS WHERE ADDRESSID = ?', [addressId]);
            expect(result).toEqual(mockAddress[0]);
        });

        it('should return null if no address is found', async () => {
            (connection.execute as jest.Mock).mockResolvedValue([[]]);

            const addressId = '1';
            const result = await getAddressById(addressId);

            expect(connection.execute).toHaveBeenCalledWith('SELECT * FROM ADDRESS WHERE ADDRESSID = ?', [addressId]);
            expect(result).toBeNull();
        });
    });
});
