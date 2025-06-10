// Em src/app/services/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('token');

  // Se não houver token, continua a requisição sem modificá-la
  if (!token) {
    return next(req);
  }

  // Se houver token, clona a requisição e adiciona o cabeçalho de autorização
  const reqWithAuth = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(reqWithAuth);
};