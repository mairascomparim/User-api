import bcrypt from 'bcrypt';
import connection from './connection';
import { RowDataPacket } from 'mysql2';

interface User {
  USERID: number;
  NAME: string;
  EMAIL: string;
  ADDRESSES: Address[];
}

interface Address {
  ROAD: string;
  CITY: string;
  STATE: string;
  ZIPCODE: string;
  COUNTRY: string;
}

const getAll = async (email: string): Promise<User[]> => {
    const query = `
      SELECT U.USERID, U.NAME, U.EMAIL, A.ROAD, A.CITY, A.STATE, A.ZIPCODE, A.COUNTRY 
      FROM USER U INNER JOIN ADDRESS A ON U.USERID = A.USERID WHERE U.EMAIL = ? 
    `;
  
    // Execute a consulta e desestruture o resultado
    const [rows] = await connection.execute<RowDataPacket[]>(query, [email]);
  
    // Transforme o resultado em um formato de User agrupado por USERID
    const groupedData = rows.reduce((acc: Record<number, User>, row: any) => {
      if (!acc[row.USERID]) {
        acc[row.USERID] = {
          USERID: row.USERID,
          NAME: row.NAME,
          EMAIL: row.EMAIL,
          ADDRESSES: [],
        };
      }
  
      acc[row.USERID].ADDRESSES.push({
        ROAD: row.ROAD,
        CITY: row.CITY,
        STATE: row.STATE,
        ZIPCODE: row.ZIPCODE,
        COUNTRY: row.COUNTRY,
      });
  
      return acc;
    }, {} as Record<number, User>);
  
    return Object.values(groupedData);
  };

const createUser = async ({ name, email, password }: { name: string; email: string; password: string }): Promise<{ insertId: number }> => {
    const createdAt = new Date().toISOString();
    const query = `
      INSERT INTO USER (NAME, EMAIL, PASSWORD, created_at) 
      VALUES (?, ?, ?, ?)
    `;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    // Execute a consulta e desestruture o resultado
    const [result] = await connection.execute<any>(query, [name, email, hash, createdAt]);
  
    // O resultado pode ser um array, então você precisa acessar a propriedade corretamente
    const insertId = (result as any).insertId;
  
    if (insertId !== undefined) {
      return { insertId };
    } else {
      throw new Error('Failed to get insertId from result');
    }
  };

const deleteUser = async (id: number): Promise<any> => {
  const [removedUser] = await connection.execute('DELETE FROM USER WHERE USERID = ?', [id]);
  return removedUser;
};

const updateUser = async (id: number, user: { name: string; email: string }): Promise<any> => {
  const { name, email } = user;
  const query = 'UPDATE USER SET NAME = ?, EMAIL = ? WHERE USERID = ?';
  const updatedUser = await connection.execute(query, [name, email, id]);
  return updatedUser;
};

const getUserByEmail = async (email: string): Promise<any> => {
  const query = 'SELECT NAME, EMAIL, PASSWORD FROM USER WHERE EMAIL = ?';
  const [users] = await connection.execute(query, [email]);
  return users;
};

const verifyPassword = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> => {
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

export {
  getAll,
  createUser,
  deleteUser,
  updateUser,
  getUserByEmail,
  verifyPassword,
};
