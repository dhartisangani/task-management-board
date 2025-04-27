"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "@/components/TaskCard";
import { PlusIcon } from "@heroicons/react/16/solid";
import AddTaskModal from "@/components/form/AddTaskModal";
import { Task } from "@/types/Types";
import { API } from "@/constants/api";

const statusList = ["todo", "inprogress", "done"];

function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);

    const fetchTasks = async () => {
        const res = await fetch(`${API.TASKS}?_limit=15`);
        const data = await res.json();
        const mappedTasks = data.map((item:Task ) => ({
            id: item.id.toString(),
            title: item.title,
            description: item.description || "No description",
            status: item.status || "todo",
        }));
        setTasks(mappedTasks);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditTask(null);
    };

    const handleEditTask = (task: Task) => {
        setEditTask(task);
        setShowModal(true);
    };

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }
        const draggedTask = tasks.find((task) => task.id === draggableId);
        if (!draggedTask) return;
        const filteredTasks = tasks.filter((task) => task.id !== draggableId);
        const updatedTask = {
            ...draggedTask,
            status: destination.droppableId as "todo" | "inprogress" | "done",
        };
    
        const newTasks = [
            ...filteredTasks.slice(0, destination.index),
            updatedTask, 
            ...filteredTasks.slice(destination.index), 
        ];

        setTasks(newTasks);
        try {
            const res = await fetch(`${API.TASKS}/${draggableId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: updatedTask.status }),
            });
    
            if (!res.ok) {
                throw new Error("Failed to update task status on the server");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
            setTasks(tasks);
        }
    };

    const handleDeleteTask = async (id: string) => {
        await fetch(`${API.TASKS}/${id}`, {
            method: "DELETE",
        });
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const handleSaveTask = async (taskData: Task) => {
        if (editTask) {
            await fetch(`${API.TASKS}/${taskData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData),
            });
            setTasks((prev) => prev.map((task) => (task.id === taskData.id ? taskData : task)));
            setEditTask(null);
        } else {
            const res = await fetch(API.TASKS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData),
            });
            const newTask = await res.json();
            setTasks((prev) => [...prev, newTask]);
        }
        setShowModal(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-center sm:text-left max-sm:text-lg">Task Management Board</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Task</span>
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statusList.map((status) => (
                        <div key={status} className="bg-gray-100 rounded-lg flex flex-col min-h-[500px]">
                            <Droppable droppableId={status}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 flex flex-col rounded-lg transition
                                            ${snapshot.isDraggingOver ? "bg-blue-100" : "bg-gray-100"}
                                            ${status === "todo" ? "border-t-4 border-pink-400" : ""}
                                            ${status === "inprogress" ? "border-t-4 border-yellow-400" : ""}
                                            ${status === "done" ? "border-t-4 border-green-400" : ""}
                                        `}
                                    >
                                        <h2 className="text-xl font-semibold capitalize p-4">
                                            {status.replace("inprogress", "In Progress")}
                                        </h2>
                                        <hr className="border-gray-300" />
                                        <div className="flex flex-col gap-4 p-4">
                                            {tasks
                                                .filter((task) => task.status === status)
                                                .map((task, index) => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                        index={index}
                                                        onEdit={handleEditTask}
                                                        onDelete={handleDeleteTask}
                                                    />
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {showModal && (
                <AddTaskModal
                    onClose={handleModalClose}
                    onAdd={handleSaveTask}
                    editTask={editTask}
                />
            )}
        </div>
    );
}

export default TaskBoard;
