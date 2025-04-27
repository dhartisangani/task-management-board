"use client";

import { Task } from "@/types/Types";
import { Draggable } from "@hello-pangea/dnd";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-xl shadow-lg border border-gray-300 flex items-start gap-4 relative"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-gray-500 mt-2">{task.description}</p>
            )}
          </div>
          <div className="flex gap-2 text-sm">
          <button
              onClick={() => onEdit?.(task)}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete?.(task.id)}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
