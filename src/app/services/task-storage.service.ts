import { Injectable } from '@angular/core';

export interface Task {
  id?: number;
  name: string;
  status: 'Planned' | 'Completed';
  date: string;
  description: string;
  completedAt?: number;
  tags?: string[];
  flagged?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStorageService {
  private dbName = 'TasksDB';
  private storeName = 'tasks';
  private db: IDBDatabase | null = null;
  private dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);

      request.onerror = () => {
        console.error('Database failed to open');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        const oldVersion = event.oldVersion;
        
        if (this.db && !this.db.objectStoreNames.contains(this.storeName)) {
          const objectStore = this.db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          objectStore.createIndex('status', 'status', { unique: false });
          objectStore.createIndex('date', 'date', { unique: false });
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('completedAt', 'completedAt', { unique: false });
          
          console.log('Object store created');
        } else if (oldVersion < 2 && this.db) {
          const transaction = event.target.transaction;
          const objectStore = transaction.objectStore(this.storeName);
          
          if (!objectStore.indexNames.contains('completedAt')) {
            objectStore.createIndex('completedAt', 'completedAt', { unique: false });
            console.log('Added completedAt index');
          }
        }
      };
    });
  }

  async addTask(task: Omit<Task, 'id'>): Promise<number> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(task);

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async updateTask(task: Task): Promise<void> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      if (!this.db || !task.id) {
        reject('Database not initialized or task has no id');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put(task);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAllTasks(): Promise<Task[]> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result as Task[]);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearAllTasks(): Promise<void> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }
}

