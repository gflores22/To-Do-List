package com.todoproject.todo_backend.service;

import com.todoproject.todo_backend.model.Task;
import com.todoproject.todo_backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import correto para transações

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    @Transactional
    public Task createTask(Task task) {
        task.setId(null); // Garante que o ID é nulo para criar uma nova tarefa
        return taskRepository.save(task);
    }

    @Transactional
    public Optional<Task> updateTask(Long id, Task taskDetails) {
        return taskRepository.findById(id)
                .map(existingTask ->{
                    existingTask.setDescription(taskDetails.getDescription());
                    existingTask.setCompleted(taskDetails.isCompleted());
                    return taskRepository.save(existingTask);
                });
    }

    @Transactional
    public Optional<Task> updateTaskCompletion(Long id, boolean completed) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setCompleted(completed);
                    return taskRepository.save(existingTask);
                });
    }

    @Transactional
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
