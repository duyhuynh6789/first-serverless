import { TodoItem } from './../models/TodoItem';
// import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import * as AWS from 'aws-sdk';
import { TodosAccess } from './todosAcess';


const todosAccess = new TodosAccess();


// TODO: Implement businessLogic
export const getTodosForUser = async (): Promise<TodoItem[]> => {
    return todosAccess.getTodosForUser();
}