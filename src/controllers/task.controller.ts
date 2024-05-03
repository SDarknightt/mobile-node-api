import {PrismaClient} from "@prisma/client";
import multer from 'multer';
import * as path from "path";
import fs from 'fs';

const taskClient = new PrismaClient().task;

//Cria as tarefas diretamente vinculada ao usuario
export const createTask = async (req, res) => {
    try {
        const { title, description, user } = req.body;
        const newTask = await taskClient.create({
            data: {
                title: title,
                description: description,
                responsibleId: user.id,
                creationDate: new Date(),
            },
        });
        res.status(200).json({data: newTask as Task});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
};

export const getTasks = async (req, res) => {
    try {
        const {user} = req.body;
        const responseTask = await taskClient.findMany({
            where: {
                responsibleId: user.id,
            },
        });
        res.status(200).json({data: responseTask as Task[]});
    } catch (e) {
        res.status(500).json({error: e.message});
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
        res.status(500).json({error: e.message});
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
        res.status(500).json({error: e.message});
    }
};

export type Task = {
    id: string,
    title: string,
    description: string | null,
    status: string,
    imageUrl: string | null
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
        res.status(500).json({error: e.message});
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

export const uploadImageTask = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { id } = req.body;

        const filePath = req.file.path.replace(/\\/g, '/');

        try {
            const task = await taskClient.update({
                where: { id },
                data: { imageUrl: filePath },
            });

            res.json(task);
        } catch (error) {
            res.status(500).send(error);
        }
    });
};

export const removeImageTask = async (req, res) => {
    const { id } = req.body;

    try {
        const task = await taskClient.findUnique({
            where: { id },
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const imagePath = path.resolve(task.imageUrl);

        if (fs.existsSync(imagePath)) {
            console.log('Removing image', imagePath);
            fs.unlinkSync(imagePath);
        }

        const updatedTask = await taskClient.update({
            where: { id },
            data: { imageUrl: null },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).send(error);
    }
};