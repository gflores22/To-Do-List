document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('addTaskForm');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskList = document.getElementById('taskList');
    const loadingMessage = document.getElementById('loadingMessage');

    const apiUrl = 'http://localhost:8080/api/tasks';


    async function fetchTasks() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            taskList.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar tarefas. Verifique se o backend está rodando.</li>`;
        } finally {
             if(loadingMessage) loadingMessage.style.display = 'none';
        }
    }

    async function addTask(description) {
         try {
             const response = await fetch(apiUrl, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({ description: description, completed: false }),
             });
             if (!response.ok) {
                  if (response.status === 400) {
                     alert('Descrição da tarefa não pode ser vazia.');
                  } else {
                     throw new Error(`Erro HTTP: ${response.status}`);
                  }
                  return false;
             }
             await fetchTasks();
             return true;
         } catch (error) {
             console.error('Erro ao adicionar tarefa:', error);
             alert('Não foi possível adicionar a tarefa.');
             return false;
         }
    }

     async function toggleTaskCompletion(taskId, isCompleted) {
         try {
            const taskResponse = await fetch(`${apiUrl}/${taskId}`);
            if (!taskResponse.ok) throw new Error('Tarefa não encontrada para toggle');
            const task = await taskResponse.json();

            await updateTask(taskId, task.description, isCompleted);
         } catch (error) {
             console.error('Erro ao buscar ou atualizar status da tarefa:', error);
             alert('Não foi possível atualizar o status da tarefa.');
         }
     }

     // Função para atualizar a tarefa (usada tanto para edição quanto para marcar como concluída)
     async function updateTask(taskId, newDescription, isCompleted) {
         try {
             const response = await fetch(`${apiUrl}/${taskId}`, {
                 method: 'PUT',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({ description: newDescription, completed: isCompleted }),
             });

             if (!response.ok) {
                  if (response.status === 400) {
                     alert('Descrição da tarefa não pode ser vazia.');
                  } else {
                    throw new Error(`Erro HTTP: ${response.status}`);
                  }
                  return false; 
             }

             await fetchTasks();
             return true; 
         } catch (error) {
             console.error('Erro ao atualizar tarefa:', error);
             alert('Não foi possível atualizar a tarefa.');
             return false;
         }
     }


    async function deleteTask(taskId) {
          if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
              return;
          }
         try {
             const response = await fetch(`${apiUrl}/${taskId}`, {
                 method: 'DELETE',
             });
             if (!response.ok) {
                  if (response.status === 404) {
                      console.warn(`Tarefa com ID ${taskId} não encontrada para exclusão.`);
                  } else {
                      throw new Error(`Erro HTTP: ${response.status}`);
                  }
             }
             const taskElement = document.getElementById(`task-${taskId}`);
             if (taskElement) {
                 taskElement.remove();
             } else {
                 await fetchTasks();
             }
              checkEmptyList();
         } catch (error) {
             console.error('Erro ao deletar tarefa:', error);
             alert('Não foi possível excluir a tarefa.');
         }
    }

    // --- Funções de Manipulação do DOM ---

    function renderTasks(tasks) {
        taskList.innerHTML = '';
         if (tasks.length === 0) {
             checkEmptyList();
             return;
         }
        tasks.sort((a, b) => a.id - b.id);
        tasks.forEach(task => {
            renderTask(task); 
        });
         checkEmptyList();
    }

    function renderTask(task) {
        const listItem = document.createElement('li');
        listItem.id = `task-${task.id}`;
        listItem.className = `list-group-item d-flex justify-content-between align-items-center task-item ${task.completed ? 'completed' : ''}`;
        // Guarda a descrição original para o caso de cancelar a edição
        listItem.dataset.originalDescription = task.description;

        // Container para Checkbox e Descrição (ou Input de Edição)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content-wrapper d-flex align-items-center flex-grow-1 me-3'; 

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-3 task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            toggleTaskCompletion(task.id, checkbox.checked);
        });

        // Span para mostrar a descrição (será escondido durante a edição)
        const descriptionSpan = document.createElement('span');
        descriptionSpan.textContent = task.description;
        descriptionSpan.className = 'task-description';

        // Input para editar a descrição (inicialmente escondido)
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'form-control task-edit-input d-none'; // Começa escondido (d-none)
        editInput.value = task.description;

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(descriptionSpan);
        contentDiv.appendChild(editInput); // Adiciona o input escondido

        // Container para os Botões de Ação
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions flex-shrink-0'; 

        // Botão Editar (será escondido durante a edição)
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm me-1 task-edit-button'; 
        editButton.innerHTML = '<i class="bi bi-pencil"></i>';
        editButton.title = 'Editar Tarefa';
        editButton.addEventListener('click', () => {
            enterEditMode(listItem, task);
        });

        // Botão Excluir (será escondido durante a edição)
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm task-delete-button';
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.title = 'Excluir Tarefa';
        deleteButton.addEventListener('click', () => {
            deleteTask(task.id);
        });

        // Botão Salvar (inicialmente escondido)
        const saveButton = document.createElement('button');
        saveButton.className = 'btn btn-success btn-sm me-1 task-save-button d-none'; // Começa escondido
        saveButton.innerHTML = '<i class="bi bi-check-lg"></i>'; 
        saveButton.title = 'Salvar Alterações';
        saveButton.addEventListener('click', async () => {
            await saveEdit(listItem, task, editInput);
        });

         // Botão Cancelar (inicialmente escondido)
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-secondary btn-sm task-cancel-button d-none'; // Começa escondido
        cancelButton.innerHTML = '<i class="bi bi-x-lg"></i>'; 
        cancelButton.title = 'Cancelar Edição';
        cancelButton.addEventListener('click', () => {
            exitEditMode(listItem);
        });

        // Adiciona botões ao div de ações
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        actionsDiv.appendChild(saveButton); 
        actionsDiv.appendChild(cancelButton); 

        // Adiciona tudo ao item da lista
        listItem.appendChild(contentDiv);
        listItem.appendChild(actionsDiv);
        taskList.appendChild(listItem);

        // Adiciona listener para tecla Enter no input de edição
        editInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Previne submit de formulário se houver
                await saveEdit(listItem, task, editInput);
            }
        });
         // Adiciona listener para tecla Esc no input de edição
         editInput.addEventListener('keydown', (e) => {
             if (e.key === 'Escape') {
                 exitEditMode(listItem);
             }
         });
    }

    // Função para entrar no modo de edição
    function enterEditMode(listItem) {
        // Esconde descrição e botões de ação padrão
        listItem.querySelector('.task-description').classList.add('d-none');
        listItem.querySelector('.task-edit-button').classList.add('d-none');
        listItem.querySelector('.task-delete-button').classList.add('d-none');

        // Mostra input e botões de salvar/cancelar
        const editInput = listItem.querySelector('.task-edit-input');
        editInput.classList.remove('d-none');
        editInput.value = listItem.dataset.originalDescription; 
        editInput.focus(); 
        editInput.select(); 
        listItem.querySelector('.task-save-button').classList.remove('d-none');
        listItem.querySelector('.task-cancel-button').classList.remove('d-none');
    }

    // Função para sair do modo de edição (seja por salvar ou cancelar)
    function exitEditMode(listItem) {
         // Esconde input e botões de salvar/cancelar
        listItem.querySelector('.task-edit-input').classList.add('d-none');
        listItem.querySelector('.task-save-button').classList.add('d-none');
        listItem.querySelector('.task-cancel-button').classList.add('d-none');

        // Mostra descrição e botões de ação padrão
        listItem.querySelector('.task-description').classList.remove('d-none');
        listItem.querySelector('.task-edit-button').classList.remove('d-none');
        listItem.querySelector('.task-delete-button').classList.remove('d-none');
    }

    // Função para salvar a edição
    async function saveEdit(listItem, task, inputElement) {
        const newDescription = inputElement.value.trim();
        if (!newDescription) {
            alert('A descrição não pode ficar vazia.');
            inputElement.focus();
            return;
        }

        // Chama a função de update geral, passando a nova descrição e o status de completude ATUAL
        const success = await updateTask(task.id, newDescription, task.completed);
    }


    function checkEmptyList() {
         const existingEmptyMessage = taskList.querySelector('.empty-list-message');
          if (taskList.children.length === 0 || (taskList.children.length === 1 && taskList.children[0] === loadingMessage) ) {
              if (!existingEmptyMessage && loadingMessage && loadingMessage.style.display === 'none') { // Só adiciona se não estiver carregando
                  const emptyMessage = document.createElement('li');
                  emptyMessage.className = 'list-group-item text-muted text-center empty-list-message';
                  emptyMessage.textContent = 'Nenhuma tarefa encontrada.';
                  taskList.appendChild(emptyMessage);
              }
          } else {
              if (existingEmptyMessage) {
                  existingEmptyMessage.remove();
              }
              if (loadingMessage && loadingMessage.parentNode === taskList) {
                 loadingMessage.remove();
              }
          }
    }

    // --- Event Listeners ---
    taskForm.addEventListener('submit', async (event) => {
         event.preventDefault();
         const description = taskDescriptionInput.value.trim();
         if (description) {
             const success = await addTask(description);
             if (success) {
                 taskDescriptionInput.value = '';
                 taskDescriptionInput.focus();
             }
         } else {
              alert('Por favor, digite a descrição da tarefa.');
              taskDescriptionInput.focus();
         }
    });

    // --- Inicialização ---
    fetchTasks();
});