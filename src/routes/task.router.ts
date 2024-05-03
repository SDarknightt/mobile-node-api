import { Router } from "express";

import {authenticateToken} from "../controllers/authenticate-token";
import {
    createTask,
    deleteTask,
    editTask,
    getTaskById,
    getTasks,
    removeImageTask,
    uploadImageTask
} from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.get("/getAll", authenticateToken, getTasks);
taskRouter.get("/details", authenticateToken, getTaskById);
taskRouter.post("/create", authenticateToken, createTask);
taskRouter.delete("/delete", authenticateToken, deleteTask);
taskRouter.post("/edit", authenticateToken, editTask);
taskRouter.post("/upload",authenticateToken, uploadImageTask);
taskRouter.post("/remove",authenticateToken, removeImageTask);


export default taskRouter;