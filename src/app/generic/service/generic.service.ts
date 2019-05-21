import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TotvsResponse } from 'src/app/model/totvs-response.interface';
import { ObjectLength } from 'src/app/model/objectLength';

import { environment } from '../../../environments/environment';

@Injectable()
export class GenericService<T> {

  
  private readonly host: string = environment.host; 
  private readonly port: number = environment.port;
  private readonly apiName: string = environment.apiName;
  private readonly apiVersion: string = environment.apiVersion;
  private readonly urlApi: string = `${this.host}:${this.port}/${this.apiName}/${this.apiVersion}`; 
  
  protected path: string;

  constructor(private http: HttpClient) {}

  get(): Observable<TotvsResponse> {
    return this.http.get<TotvsResponse>(`${this.urlApi}/${this.path}`);
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.urlApi}/${this.path}/${id}`);
  }
  
  delete(id: string): Observable<{}> {
    return this.http.delete<{}>(`${this.urlApi}/${this.path}/${id}`).pipe(map(() => (id), error => (error)));
  }

  getCount(): Observable<number> {
    return this.http.get<ObjectLength>(`${this.urlApi}/${this.path}/count/`).pipe(map(result => (result.length)));
  }

  post(entity: any): Observable<T> {
    return this.http.post<T>(`${this.urlApi}/${this.path}`, entity);
  }

  postWithPath(path: string, entity: any): Observable<T> {
    return this.http.post<T>(`${this.urlApi}/${this.path}/${path}`, entity);
  }

  put(entity: any): Observable<T> {
    return this.http.put<T>(`${this.urlApi}/${this.path}/${entity.id}`, entity);
  }


}
