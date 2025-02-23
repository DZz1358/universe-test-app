import type { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../service/storage.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService);
  const authToken = storageService.getToken();

  console.log('Intercepted request to:', req.url);
  console.log('Token before request:', authToken);

  if (!authToken) {
    console.log('No token, sending request without Authorization header.');
    return next(req);
  }

  const authRequest = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authToken)
  });
  return next(authRequest);

};

