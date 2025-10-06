// Servicio de autenticación básico para FitiPlus
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  isOnboardingCompleted?: boolean;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authToken: string | null = null;

  private constructor() {
    // Cargar datos del localStorage al inicializar
    this.loadFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simular llamada a API
      await this.simulateApiCall();

      // Validación básica (en producción esto vendría del servidor)
      if (
        credentials.email === 'admin@fitiplus.com' &&
        credentials.password === 'admin123'
      ) {
        const user: User = {
          id: '1',
          email: credentials.email,
          name: 'Usuario Administrador',
          avatar: 'https://via.placeholder.com/150',
        };

        const token = this.generateToken();

        this.currentUser = user;
        this.authToken = token;

        // Guardar en localStorage
        this.saveToStorage();

        return {
          success: true,
          user,
          token,
          message: 'Inicio de sesión exitoso',
          isOnboardingCompleted: false,
        };
      } else {
        return {
          success: false,
          message: 'Credenciales inválidas',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error al iniciar sesión. Intenta nuevamente.',
      };
    }
  }

  /**
   * Cerrar sesión
   */
  public logout(): void {
    this.currentUser = null;
    this.authToken = null;
    this.clearStorage();
  }

  /**
   * Verificar si el usuario está autenticado
   */
  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  /**
   * Obtener el usuario actual
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Obtener el token de autenticación
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Verificar si el token es válido
   */
  public isTokenValid(): boolean {
    if (!this.authToken) return false;

    try {
      // En una implementación real, verificarías el token con el servidor
      // Por ahora, simplemente verificamos que existe
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Renovar token de autenticación
   */
  public async refreshToken(): Promise<boolean> {
    try {
      // Simular llamada a API para renovar token
      await this.simulateApiCall();

      if (this.isAuthenticated()) {
        this.authToken = this.generateToken();
        this.saveToStorage();
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Cambiar contraseña
   */
  public async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthResponse> {
    try {
      if (!this.isAuthenticated()) {
        return {
          success: false,
          message: 'Usuario no autenticado',
        };
      }

      // Simular validación de contraseña actual
      await this.simulateApiCall();

      // En producción, validarías la contraseña actual con el servidor
      if (currentPassword === 'admin123') {
        return {
          success: true,
          message: 'Contraseña actualizada exitosamente',
        };
      } else {
        return {
          success: false,
          message: 'Contraseña actual incorrecta',
        };
      }
    } catch {
      return {
        success: false,
        message: 'Error al cambiar contraseña',
      };
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  public async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      await this.simulateApiCall();

      // Simular envío de email
      return {
        success: true,
        message:
          'Se ha enviado un enlace de recuperación a tu correo electrónico',
      };
    } catch {
      return {
        success: false,
        message: 'Error al enviar solicitud de recuperación',
      };
    }
  }

  // Métodos privados

  private generateToken(): string {
    // Generar un token simple (en producción usarías JWT o similar)
    return btoa(
      JSON.stringify({
        userId: this.currentUser?.id,
        timestamp: Date.now(),
        random: Math.random(),
      }),
    );
  }

  private simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000 + Math.random() * 1000);
    });
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('fitiplus_user', JSON.stringify(this.currentUser));
      localStorage.setItem('fitiplus_token', this.authToken || '');
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const userData = localStorage.getItem('fitiplus_user');
      const token = localStorage.getItem('fitiplus_token');

      if (userData && token) {
        this.currentUser = JSON.parse(userData);
        this.authToken = token;
      }
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem('fitiplus_user');
      localStorage.removeItem('fitiplus_token');
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }
}

// Exportar instancia singleton
export const authService = AuthService.getInstance();
export default authService;
