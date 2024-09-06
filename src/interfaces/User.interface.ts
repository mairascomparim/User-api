import { Address } from './Address.interface'

interface User {
  USERID: number;
  NAME: string;
  EMAIL: string;
  ADDRESSES: Address[];
}

export{
  User
}