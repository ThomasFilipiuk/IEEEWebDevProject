import { config } from 'dotenv';
import { executeStudentCrudOperations } from './mongotest_studentscrud.js';

config();
console.log(process.env.DB_URI);
await executeStudentCrudOperations();