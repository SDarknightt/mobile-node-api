import {PrismaClient} from "@prisma/client";

const taskClient = new PrismaClient().task;

//Cria as tarefas diretamente vinculada ao usuario
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = await taskClient.create({
            data: {
                title: title,
                description: description,
                responsibleId: req.body.user.userId,
                creationDate: new Date(),
            },
        });
        res.status(200).json({data: newTask as Task});
    } catch (error) {
        throw new Error('Error creating task');
    }
};

export const getTasks = async (req, res) => {
    try {
        const responseTask = await taskClient.findMany({
            where: {
                responsibleId: req.body.user.userId,
            },
        });
        res.status(200).json({data: responseTask as Task[]});
    } catch (e) {
        throw new Error('Error getting user tasks');
    }
};

export const getTaskById = async (req, res) => {
    try {
        const {id} = req.body;
        const responseTask = await taskClient.findUnique({
            where: {
                id: id
            },
        });
        res.status(200).json({data: responseTask as Task});
    } catch (e) {
        throw new Error('Error getting task details');
    }
};


export const deleteTask = async (req, res) => {
    try {
        const {id} = req.body;
        const responseTask = await taskClient.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({data: responseTask as Task});
    } catch (e) {
        throw Error("Error deleting task")
    }
};

export type Task = {
    id: string,
    title: string,
    description: string | null,
    status: string
}

export const editTask = async (req, res) => {
    try {
        const {id, title, description, status} = req.body as Task;
        const responseTask = await taskClient.update({
            where: {
                id: id
            }, data: {
                id: id,
                title: title,
                description: description,
                status: status
            }
        });
        res.status(200).json({data: responseTask as Task});
    } catch (e) {
        throw Error("Error editing task")
    }
};