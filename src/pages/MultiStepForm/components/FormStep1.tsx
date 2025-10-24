import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonText,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { API_CONFIG, getApiUrl } from '../../../config/api';
import authService from '../../../services/AuthService';
import { FormData } from '../MultiStepForm';
import './FormStep1.css';

interface Goal {
  id: string;
  name: string;
  description: string;
}

interface GoalsResponse {
  goals: Goal[];
}

interface FormStep1Props {
  data: FormData;
  onNext: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  title?: string;
  description?: string;
}

const FormStep1: React.FC<FormStep1Props> = ({
  data,
  onNext,
  onUpdate,
  title = 'Información Personal',
  description = 'Cuéntanos sobre ti para personalizar tu experiencia',
}) => {
  const [formData, setFormData] = useState({
    gender: data.gender || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los objetivos desde la API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        console.log('🎯 [GOALS] Iniciando carga de objetivos...');
        setLoading(true);
        setError(null);

        const token = authService.getAuthToken();
        console.log(
          '🔑 [GOALS] Token obtenido:',
          token ? 'Existe' : 'No existe',
        );

        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const url = getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDING_GOALS);
        console.log('🌐 [GOALS] URL de consulta:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('📡 [GOALS] Respuesta status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [GOALS] Error en respuesta:', errorText);
          throw new Error('Error al cargar los objetivos');
        }

        const data: GoalsResponse = await response.json();
        console.log('📊 [GOALS] Datos recibidos:', data);
        console.log('📊 [GOALS] Objetivos a cargar:', data.goals);
        setGoals(data.goals);
      } catch (err) {
        console.error('💥 [GOALS] Error al cargar objetivos:', err);
        setError('No se pudieron cargar los objetivos');
        // En caso de error, usar objetivos por defecto
        setGoals([
          {
            id: 'lose_weight',
            name: 'Perder peso',
            description: 'Ayudarte a alcanzar tu peso ideal de forma saludable',
          },
          {
            id: 'maintain',
            name: 'Mantener peso',
            description:
              'Mantener tu peso actual con una alimentación balanceada',
          },
          {
            id: 'gain_muscle',
            name: 'Ganar músculo',
            description: 'Desarrollar masa muscular con la nutrición adecuada',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.gender) {
      newErrors.gender = 'Selecciona tu objetivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: '' }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <IonCard className="form-step-card">
        <IonCardHeader>
          <IonCardTitle className="step-title">
            <IonText color="primary">
              <h2>{title}</h2>
            </IonText>
            <IonText color="medium">
              <p>{description}</p>
            </IonText>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className="form-step-card">
      <IonCardHeader>
        <IonCardTitle className="step-title">
          <IonText color="primary">
            <h2>{title}</h2>
          </IonText>
          <IonText color="medium">
            <p>{description}</p>
          </IonText>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {error && (
          <IonText
            color="warning"
            style={{ textAlign: 'center', padding: '10px', display: 'block' }}
          >
            <p>{error}</p>
          </IonText>
        )}

        <div className="form-fields">
          <div className="gender-selection-container">
            <IonText className="gender-label">
              <p>¿Cuál es tu objetivo?</p>
            </IonText>
            <div className="gender-cards">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`gender-card ${
                    formData.gender === goal.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(goal.id)}
                  title={goal.description}
                >
                  <IonText className="gender-card-text">{goal.name}</IonText>
                </div>
              ))}
            </div>
            {errors.gender && (
              <IonText color="danger" className="error-text">
                {errors.gender}
              </IonText>
            )}
          </div>
        </div>

        <div className="form-actions">
          <IonButton
            expand="block"
            onClick={handleNext}
            className="next-button"
          >
            Siguiente
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default FormStep1;
