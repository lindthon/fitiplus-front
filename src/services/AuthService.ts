// Servicio de autenticación para FitiPlus con integración de API externa
import { API_CONFIG, getApiUrl } from '../config/api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Mantener para compatibilidad
  role?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dietaryRestrictions?: string[];
  allergies?: string[];
  fitnessGoals?: string[];
  activityLevel?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  token?: string; // Mantener para compatibilidad
  refreshToken?: string;
  message?: string;
  isOnboardingCompleted?: boolean;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private isOnline: boolean = true;

  private constructor() {
    // Cargar datos del localStorage al inicializar
    this.loadFromStorage();
    // Verificar conectividad
    this.checkConnectivity();
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
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    console.log(`🔐 [LOGIN] Iniciando proceso de login`, {
      requestId,
      email: credentials.email,
      timestamp: new Date().toISOString(),
      isOnline: this.isOnline,
      apiUrl: API_CONFIG.BASE_URL,
    });

    try {
      // Si no hay conexión, usar modo offline
      if (!this.isOnline) {
        console.warn(`⚠️ [LOGIN] Modo offline detectado`, {
          requestId,
          email: credentials.email,
        });
        return this.loginOffline(credentials);
      }

      console.log(`📡 [LOGIN] Enviando petición al API`, {
        requestId,
        endpoint: API_CONFIG.ENDPOINTS.LOGIN,
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
        timeout: API_CONFIG.TIMEOUT,
      });

      const response = await this.makeApiRequest(
        'POST',
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials,
      );

      const duration = Date.now() - startTime;

      if (response.success && response.data) {
        const { user, accessToken, refreshToken, isOnboardingCompleted } =
          response.data;

        console.log(`✅ [LOGIN] Login exitoso`, {
          requestId,
          userId: user?.id,
          userEmail: user?.email,
          userName: user?.firstName || user?.name,
          tokenLength: accessToken?.length,
          refreshTokenLength: refreshToken?.length,
          isOnboardingCompleted,
          duration: `${duration}ms`,
        });

        this.currentUser = user;
        this.authToken = accessToken || '';
        this.refreshToken = refreshToken;

        // Guardar en localStorage
        this.saveToStorage();

        console.log(`💾 [LOGIN] Datos guardados en localStorage`, {
          requestId,
          userId: user?.id,
        });

        return {
          success: true,
          user,
          accessToken,
          token: accessToken, // Mantener para compatibilidad
          refreshToken,
          message: 'Inicio de sesión exitoso',
          isOnboardingCompleted: isOnboardingCompleted || false,
        };
      } else {
        console.error(`❌ [LOGIN] Error en respuesta del API`, {
          requestId,
          error: response.error,
          statusCode: response.statusCode,
          duration: `${duration}ms`,
        });

        return {
          success: false,
          message: response.error || 'Credenciales inválidas',
          statusCode: response.statusCode,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(`💥 [LOGIN] Error crítico en login`, {
        requestId,
        error: error instanceof Error ? error.message : 'Error desconocido',
        errorType:
          error instanceof Error ? error.constructor.name : typeof error,
        duration: `${duration}ms`,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        success: false,
        message: 'Error al iniciar sesión. Intenta nuevamente.',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Registro de nuevo usuario
   */
  public async register(
    credentials: RegisterCredentials,
  ): Promise<AuthResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    console.log(`📝 [REGISTER] Iniciando proceso de registro`, {
      requestId,
      email: credentials.email,
      name: credentials.name,
      hasPhone: !!credentials.phone,
      hasDateOfBirth: !!credentials.dateOfBirth,
      hasGender: !!credentials.gender,
      timestamp: new Date().toISOString(),
      isOnline: this.isOnline,
      apiUrl: API_CONFIG.BASE_URL,
    });

    try {
      if (!this.isOnline) {
        console.warn(`⚠️ [REGISTER] Modo offline detectado`, {
          requestId,
          email: credentials.email,
        });

        return {
          success: false,
          message: 'No hay conexión a internet. Intenta más tarde.',
        };
      }

      console.log(`📡 [REGISTER] Enviando petición al API`, {
        requestId,
        endpoint: API_CONFIG.ENDPOINTS.REGISTER,
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        timeout: API_CONFIG.TIMEOUT,
      });

      const response = await this.makeApiRequest(
        'POST',
        API_CONFIG.ENDPOINTS.REGISTER,
        credentials,
      );

      const duration = Date.now() - startTime;

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        console.log(`✅ [REGISTER] Registro exitoso`, {
          requestId,
          userId: user?.id,
          userEmail: user?.email,
          userName: user?.firstName || user?.name,
          tokenLength: accessToken?.length,
          refreshTokenLength: refreshToken?.length,
          duration: `${duration}ms`,
        });

        this.currentUser = user;
        this.authToken = accessToken || '';
        this.refreshToken = refreshToken;

        this.saveToStorage();

        console.log(`💾 [REGISTER] Datos guardados en localStorage`, {
          requestId,
          userId: user?.id,
        });

        return {
          success: true,
          user,
          accessToken,
          token: accessToken, // Mantener para compatibilidad
          refreshToken,
          message: 'Registro exitoso',
          isOnboardingCompleted: false,
        };
      } else {
        console.error(`❌ [REGISTER] Error en respuesta del API`, {
          requestId,
          error: response.error,
          statusCode: response.statusCode,
          duration: `${duration}ms`,
        });

        return {
          success: false,
          message: response.error || 'Error en el registro',
          statusCode: response.statusCode,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(`💥 [REGISTER] Error crítico en registro`, {
        requestId,
        error: error instanceof Error ? error.message : 'Error desconocido',
        errorType:
          error instanceof Error ? error.constructor.name : typeof error,
        duration: `${duration}ms`,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        success: false,
        message: 'Error al registrarse. Intenta nuevamente.',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Cerrar sesión
   */
  public async logout(): Promise<void> {
    try {
      // Si hay conexión, notificar al servidor
      if (this.isOnline && this.authToken) {
        await this.makeApiRequest(
          'POST',
          API_CONFIG.ENDPOINTS.LOGOUT,
          {},
          { Authorization: `Bearer ${this.authToken}` },
        );
      }
    } catch (error) {
      console.error('Error al cerrar sesión en servidor:', error);
      // Continuar con logout local aunque falle el servidor
    } finally {
      this.currentUser = null;
      this.authToken = null;
      this.refreshToken = null;
      this.clearStorage();
    }
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
  public async refreshAuthToken(): Promise<boolean> {
    try {
      if (!this.isOnline || !this.refreshToken) {
        return false;
      }

      const response = await this.makeApiRequest(
        'POST',
        API_CONFIG.ENDPOINTS.REFRESH,
        { refreshToken: this.refreshToken },
      );

      if (response.success && response.data) {
        const { accessToken, refreshToken } = response.data;
        this.authToken = accessToken || response.data.token;
        this.refreshToken = refreshToken;
        this.saveToStorage();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error al renovar token:', error);
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

      if (!this.isOnline) {
        return {
          success: false,
          message: 'No hay conexión a internet. Intenta más tarde.',
        };
      }

      const response = await this.makeApiRequest(
        'POST',
        API_CONFIG.ENDPOINTS.CHANGE_PASSWORD,
        {
          currentPassword,
          newPassword,
        },
        { Authorization: `Bearer ${this.authToken}` },
      );

      if (response.success) {
        return {
          success: true,
          message: 'Contraseña actualizada exitosamente',
        };
      } else {
        return {
          success: false,
          message: response.error || 'Error al cambiar contraseña',
          statusCode: response.statusCode,
        };
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return {
        success: false,
        message: 'Error al cambiar contraseña',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  public async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      if (!this.isOnline) {
        return {
          success: false,
          message: 'No hay conexión a internet. Intenta más tarde.',
        };
      }

      const response = await this.makeApiRequest(
        'POST',
        API_CONFIG.ENDPOINTS.RESET_PASSWORD,
        { email },
      );

      if (response.success) {
        return {
          success: true,
          message:
            'Se ha enviado un enlace de recuperación a tu correo electrónico',
        };
      } else {
        return {
          success: false,
          message:
            response.error || 'Error al enviar solicitud de recuperación',
          statusCode: response.statusCode,
        };
      }
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      return {
        success: false,
        message: 'Error al enviar solicitud de recuperación',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtener perfil del usuario
   */
  public async getUserProfile(): Promise<AuthResponse> {
    try {
      if (!this.isAuthenticated()) {
        return {
          success: false,
          message: 'Usuario no autenticado',
        };
      }

      if (!this.isOnline) {
        return {
          success: true,
          user: this.currentUser || undefined,
          message: 'Datos del perfil (modo offline)',
        };
      }

      const response = await this.makeApiRequest(
        'GET',
        API_CONFIG.ENDPOINTS.PROFILE,
        {},
        { Authorization: `Bearer ${this.authToken}` },
      );

      if (response.success && response.data) {
        this.currentUser = response.data.user;
        this.saveToStorage();

        return {
          success: true,
          user: response.data.user,
          message: 'Perfil actualizado',
        };
      } else {
        return {
          success: false,
          message: response.error || 'Error al obtener perfil',
          statusCode: response.statusCode,
        };
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return {
        success: false,
        message: 'Error al obtener perfil',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Métodos privados

  /**
   * Realizar petición HTTP al API externo
   */
  private async makeApiRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    statusCode?: number;
  }> {
    const requestStartTime = Date.now();
    const requestId = this.generateRequestId();
    const url = getApiUrl(endpoint);

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    console.log(`🌐 [HTTP] Iniciando petición`, {
      requestId,
      method,
      url,
      endpoint,
      hasData: !!data,
      hasAuth: !!headers?.Authorization,
      timeout: API_CONFIG.TIMEOUT,
      timestamp: new Date().toISOString(),
    });

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(data);
      console.log(`📤 [HTTP] Datos enviados`, {
        requestId,
        dataSize: JSON.stringify(data).length,
        dataKeys: Object.keys(data),
      });
    }

    try {
      console.log(`⏳ [HTTP] Esperando respuesta...`, {
        requestId,
        url,
      });

      const response = await fetch(url, requestOptions);
      const responseTime = Date.now() - requestStartTime;

      console.log(`📥 [HTTP] Respuesta recibida`, {
        requestId,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log(`✅ [HTTP] Petición exitosa`, {
          requestId,
          status: response.status,
          responseTime: `${responseTime}ms`,
          responseDataKeys: Object.keys(responseData),
        });

        return {
          success: true,
          data: responseData,
        };
      } else {
        console.error(`❌ [HTTP] Error en respuesta`, {
          requestId,
          status: response.status,
          statusText: response.statusText,
          responseTime: `${responseTime}ms`,
          error: responseData.message || responseData.error,
          responseData,
        });

        return {
          success: false,
          error:
            responseData.message ||
            responseData.error ||
            'Error en la petición',
          statusCode: response.status,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - requestStartTime;

      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          console.error(`⏰ [HTTP] Timeout`, {
            requestId,
            timeout: API_CONFIG.TIMEOUT,
            responseTime: `${responseTime}ms`,
            url,
          });

          return {
            success: false,
            error: 'Timeout: La petición tardó demasiado',
            statusCode: 408,
          };
        }

        console.error(`💥 [HTTP] Error de red`, {
          requestId,
          error: error.message,
          errorType: error.constructor.name,
          responseTime: `${responseTime}ms`,
          url,
          stack: error.stack,
        });

        return {
          success: false,
          error: error.message,
          statusCode: 0,
        };
      }

      console.error(`💥 [HTTP] Error desconocido`, {
        requestId,
        error: 'Error desconocido en la petición',
        responseTime: `${responseTime}ms`,
        url,
      });

      return {
        success: false,
        error: 'Error desconocido en la petición',
        statusCode: 0,
      };
    }
  }

  /**
   * Login offline (fallback cuando no hay conexión)
   */
  private async loginOffline(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    const requestId = this.generateRequestId();

    console.log(`📱 [OFFLINE] Iniciando login offline`, {
      requestId,
      email: credentials.email,
      timestamp: new Date().toISOString(),
    });

    // Simular validación básica para modo offline
    if (
      credentials.email === 'admin@fitiplus.com' &&
      credentials.password === 'admin123'
    ) {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'Usuario (Modo Offline)',
        firstName: 'Usuario',
        lastName: 'Offline',
        avatar: 'https://via.placeholder.com/150',
      };

      // Token simple para modo offline
      const accessToken = `offline_token_${Date.now()}`;

      console.log(`✅ [OFFLINE] Login offline exitoso`, {
        requestId,
        userId: user.id,
        userEmail: user.email,
        tokenLength: accessToken.length,
      });

      this.currentUser = user;
      this.authToken = accessToken;

      this.saveToStorage();

      console.log(`💾 [OFFLINE] Datos guardados en localStorage`, {
        requestId,
        userId: user.id,
      });

      return {
        success: true,
        user,
        accessToken,
        token: accessToken, // Mantener para compatibilidad
        message: 'Inicio de sesión exitoso (modo offline)',
        isOnboardingCompleted: true,
      };
    } else {
      console.warn(`❌ [OFFLINE] Credenciales inválidas`, {
        requestId,
        email: credentials.email,
      });

      return {
        success: false,
        message: 'Credenciales inválidas',
      };
    }
  }

  /**
   * Verificar conectividad
   */
  private checkConnectivity(): void {
    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Generar ID único para rastrear peticiones
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('fitiplus_user', JSON.stringify(this.currentUser));
      localStorage.setItem('fitiplus_token', this.authToken || '');
      localStorage.setItem('fitiplus_refresh_token', this.refreshToken || '');
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const userData = localStorage.getItem('fitiplus_user');
      const token = localStorage.getItem('fitiplus_token');
      const refreshToken = localStorage.getItem('fitiplus_refresh_token');

      if (userData && token) {
        this.currentUser = JSON.parse(userData);
        this.authToken = token;
        this.refreshToken = refreshToken;
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
      localStorage.removeItem('fitiplus_refresh_token');
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }
}

// Exportar instancia singleton
export const authService = AuthService.getInstance();
export default authService;
