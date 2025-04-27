"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; 
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@/types/Types";

interface AddTaskModalProps {
    onClose: () => void;
    onAdd: (task: Task) => void;
    editTask?: Task | null; 
}

// Form validation
const taskSchema = z.object({
    title: z.string().min(4, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["todo", "inprogress", "done"]),
});

type FormData = z.infer<typeof taskSchema>;

function AddTaskModal({ onClose, onAdd, editTask }: AddTaskModalProps) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(taskSchema),
    });

    useEffect(() => {
        if (editTask) {
            setValue("title", editTask.title);
            setValue("description", editTask.description || ""); 
            setValue("status", editTask.status);
        }
    }, [editTask, setValue]);

    const onSubmit = (data: FormData) => {
        const newTask: Task = {
            id: editTask?.id || uuidv4(),
            title: data.title,
            description: data.description || "",
            status: data.status,
        };
    
        onAdd(newTask);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                <h2 className="text-2xl font-bold mb-4">
                    {editTask ? "Edit Task" : "Add New Task"}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className={`w-full border p-2 mb-3 rounded ${errors.title ? 'border-red-500' : ''}`}
                        placeholder="Title"
                        {...register("title")}
                    />
                    {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>}

                    <textarea
                        className="w-full border p-2 mb-3 rounded"
                        placeholder="Description (optional)"
                        {...register("description")}
                    />

                    <select
                        className="w-full border p-2 mb-4 rounded"
                        {...register("status")}
                    >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editTask ? "Save Changes" : "Add Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
