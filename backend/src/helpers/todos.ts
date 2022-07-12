import { TodoItem } from './../models/TodoItem';
// import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import * as AWS from 'aws-sdk';
import { TodosAccess } from './todosAcess';
import * as AWSXRay from 'aws-xray-sdk'

const todosAccess = new TodosAccess();
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// TODO: Implement businessLogic
export const getTodosForUser = async (userId: String): Promise<TodoItem[]> => {
    return todosAccess.getTodosForUser(userId);
}

export async function createTodos(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {

    const todoId = uuid.v4()

    return await todosAccess.createTodosForUser({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: "http://example.com/image.png"
    })
}

export async function deleteTodos(todoId: string, userId: string) {
    // TODO: Implement validate todoItem exist in DB
    return await todosAccess.deleteTodosForUser(todoId, userId)
}

export async function updateTodos(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string) {
    return await todosAccess.updateTodosForUser(updateTodoRequest, userId, todoId)
}

export async function createTodosImagePreSignedURL(todoId: string, userId: string) {
    const imageId = uuid.v4();
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`;
    await todosAccess.updateTodosImage(imageUrl, userId, todoId)
    const url = getUploadUrl(imageId)
    return url;
}

function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: Number(urlExpiration)
    })
}