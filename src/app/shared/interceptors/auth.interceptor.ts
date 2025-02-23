import type { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';
import { StorageService } from '../service/storage.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService);
  const snackBar = inject(MatSnackBar);
  const authToken = storageService.getFromLocalStore('access_token');

  if (authToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  return next(req).pipe(
    catchError((error) => {
      snackBar.open(` ${error.error.message} `, 'Close', {
        duration: 10000,
      });

      return throwError(() => error);
    })
  );
};
