import { TaskRepository } from '../db/repositories';
import { parseTask, parsePeriod } from '../parsers';
import {
  taskCreatedMessage,
  taskListMessage,
  taskCompletedMessage,
  taskDeletedMessage,
  errorMessage
} from '../messages';

export async function handleAddTask(repo: TaskRepository, text: string): Promise<string> {
  const parsed = parseTask(text);
  
  if (!parsed) {
    return errorMessage('Não consegui entender a tarefa. Exemplo: add tarefa pagar conta às 14h #finanças');
  }
  
  try {
    const task = repo.create(parsed.title, parsed.dueTs, parsed.tag);
    return taskCreatedMessage(task.id, task.title, task.due_ts || undefined, task.tag || undefined);
  } catch (error) {
    return errorMessage('Erro ao criar tarefa.');
  }
}

export async function handleListTasks(repo: TaskRepository, text: string): Promise<string> {
  try {
    let startTs: number | undefined;
    let endTs: number | undefined;
    
    if (text.trim()) {
      const period = parsePeriod(text);
      startTs = period.startTs;
      endTs = period.endTs;
    }
    
    const tasks = repo.list('open', startTs, endTs);
    return taskListMessage(tasks);
  } catch (error) {
    return errorMessage('Erro ao listar tarefas.');
  }
}

export async function handleCompleteTask(repo: TaskRepository, text: string): Promise<string> {
  const idMatch = text.match(/\d+/);
  
  try {
    let task;
    
    if (idMatch) {
      const id = parseInt(idMatch[0], 10);
      task = repo.findById(id);
      
      if (!task) {
        return errorMessage(`Tarefa #${id} não encontrada.`);
      }
      
      if (task.status === 'done') {
        return errorMessage(`Tarefa #${id} já está concluída.`);
      }
      
      repo.complete(id);
    } else {
      // Buscar por palavra-chave
      task = repo.findByKeyword(text);
      
      if (!task) {
        return errorMessage('Tarefa não encontrada. Use o ID ou uma palavra-chave mais específica.');
      }
      
      repo.complete(task.id);
    }
    
    return taskCompletedMessage(task.id, task.title);
  } catch (error) {
    return errorMessage('Erro ao concluir tarefa.');
  }
}

export async function handleDeleteTask(repo: TaskRepository, text: string): Promise<string> {
  const idMatch = text.match(/\d+/);
  
  if (!idMatch) {
    return errorMessage('Informe o ID da tarefa. Exemplo: remover tarefa 5');
  }
  
  try {
    const id = parseInt(idMatch[0], 10);
    const task = repo.findById(id);
    
    if (!task) {
      return errorMessage(`Tarefa #${id} não encontrada.`);
    }
    
    repo.delete(id);
    return taskDeletedMessage(id);
  } catch (error) {
    return errorMessage('Erro ao remover tarefa.');
  }
}
