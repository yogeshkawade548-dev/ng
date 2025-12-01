import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  mobile: string;
  createdAt: string;
  isActive: boolean;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'https://localhost:44335/api/Users';
  }

  getUsers(): Observable<User[]> {
    const url = `${this.apiUrl}/GetAllUsers`;

    return this.http.get<User[]>(url).pipe(

      catchError(error => {

        return throwError(() => error);
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<User> {
    // Map role name to RoleId
    const roleMap: { [key: string]: number } = {
      'Admin': 1,
      'Manager': 2,
      'User': 3
    };
    
    const cleanUser = {
      name: user.name,
      email: user.email,
      username: user.username,
      password: 'DefaultPass123!', // Default password
      mobile: user.mobile,
      roleId: roleMap[user.role] || 3, // Default to User role
      isActive: user.isActive
    };
    
    return this.http.post<User>(`${this.apiUrl}/CreateUser`, cleanUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateUser(id: number, user: any): Observable<any> {
    // Map role name to RoleId
    const roleMap: { [key: string]: number } = {
      'Admin': 1,
      'Manager': 2,
      'User': 3
    };
    
    const cleanUser = {
      id: id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: 'DefaultPass123!', // Required field for backend model
      mobile: user.mobile || '',
      roleId: roleMap[user.role] || 3,
      createdAt: new Date().toISOString(),
      isActive: user.isActive
    };
    

    return this.http.put(`${this.apiUrl}/UpdateUserById/${id}`, cleanUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(

      catchError(error => {

        return throwError(() => error);
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteUserById?id=${id}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:44335/api/Roles/GetAllRoles');
  }
}
