// Em src/app/services/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // =================================================================
  // PASSO DE DIAGNÓSTICO: Adicione este console.log
  console.log(`[AuthInterceptor] Interceptando a requisição para: ${req.url}`);
  // =================================================================

  const token = localStorage.getItem('token');

  if (!token) {
    // Se não há token, o interceptor termina aqui para esta requisição.
    return next(req);
  }

  const reqWithAuth = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(reqWithAuth);
};