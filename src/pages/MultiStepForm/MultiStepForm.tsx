import {
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonText,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_CONFIG, getApiUrl } from '../../config/api';
import { ROUTES } from '../../config/routes';
import authService from '../../services/AuthService';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import FormStep3 from './components/FormStep3';
import './MultiStepForm.css';

export interface FormData {
  // Información personal
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isPregnant: boolean;

  // Objetivos fitness
  weight: number;
  height: number;
  fitnessGoal: string;
  experienceLevel: string;

  // Información de salud
  diabetes: boolean;
  hypertension: boolean;
  highCholesterol: boolean;
  allergy: boolean;
  allergyDescription: string;
}

interface OnboardingStage {
  step: number;
  title: string;
  description: string;
  contentType: string;
}

interface OnboardingStagesResponse {
  stages: OnboardingStage[];
}

interface MultiStepFormProps {
  initialData?: Partial<FormData>;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ initialData = {} }) => {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [stages, setStages] = useState<OnboardingStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    isPregnant: false,
    weight: 0,
    height: 0,
    fitnessGoal: '',
    experienceLevel: '',
    diabetes: false,
    hypertension: false,
    highCholesterol: false,
    allergy: false,
    allergyDescription: '',
    ...initialData,
  });

  const totalSteps = 3;
  const progress = currentStep / totalSteps;

  // Cargar los stages desde la API
  useEffect(() => {
    const fetchOnboardingStages = async () => {
      try {
        console.log('🚀 [STAGES] Iniciando carga de stages...');
        setLoading(true);
        setError(null);

        const token = authService.getAuthToken();
        console.log(
          '🔑 [STAGES] Token obtenido:',
          token ? 'Existe' : 'No existe',
        );

        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const url = getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDING_STAGES);
        console.log('🌐 [STAGES] URL de consulta:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('📡 [STAGES] Respuesta status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [STAGES] Error en respuesta:', errorText);
          throw new Error('Error al cargar las etapas del onboarding');
        }

        const data: OnboardingStagesResponse = await response.json();
        console.log('📊 [STAGES] Datos recibidos del API:', data);
        console.log('📊 [STAGES] Stages a cargar:', data.stages);
        setStages(data.stages);
      } catch (err) {
        console.error('Error al cargar las etapas:', err);
        setError('No se pudieron cargar las etapas del formulario');
        // En caso de error, usar etapas por defecto
        setStages([
          {
            step: 1,
            title: 'Información Personal',
            description: 'Cuéntanos sobre ti para personalizar tu experiencia',
            contentType: 'goals',
          },
          {
            step: 2,
            title: 'Objetivos Fitness',
            description: 'Define tus metas y objetivos de salud',
            contentType: 'physical_data',
          },
          {
            step: 3,
            title: 'Información de Salud',
            description: 'Ayúdanos a conocer tu estado de salud',
            contentType: 'medical_conditions',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStages();
  }, []);

  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Aquí se procesaría el formulario completo
    console.log('Formulario completo:', formData);

    // Simular envío
    setTimeout(() => {
      history.push(ROUTES.TAB1);
    }, 1000);
  };

  const getCurrentStageInfo = () => {
    const stageInfo = stages.find((s) => s.step === currentStep);

    console.log('Stages disponibles:', stages);
    console.log('Buscando step:', currentStep);
    console.log('Stage encontrado:', stageInfo);

    return (
      stageInfo || {
        step: currentStep,
        title: '',
        description: '',
        contentType: '',
      }
    );
  };

  const renderCurrentStep = () => {
    const stageInfo = getCurrentStageInfo();

    switch (currentStep) {
      case 1:
        return (
          <FormStep1
            data={formData}
            onNext={nextStep}
            onUpdate={updateFormData}
            title={stageInfo.title}
            description={stageInfo.description}
          />
        );
      case 2:
        return (
          <FormStep2
            data={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateFormData}
            title={stageInfo.title}
            description={stageInfo.description}
          />
        );
      case 3:
        return (
          <FormStep3
            data={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            onUpdate={updateFormData}
            title={stageInfo.title}
            description={stageInfo.description}
          />
        );
      default:
        return null;
    }
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <IonPage>
        <IonHeader></IonHeader>
        <IonContent className="multi-step-form-content">
          <div
            className="form-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader></IonHeader>

      <IonContent className="multi-step-form-content">
        <div className="form-container">
          {error && (
            <IonText
              color="warning"
              style={{ textAlign: 'center', padding: '10px' }}
            >
              <p>{error}</p>
            </IonText>
          )}

          {/* Progress Bar */}
          <div className="progress-section">
            <IonText className="step-indicator">
              Paso {currentStep} de {totalSteps}
            </IonText>
            <IonProgressBar value={progress} className="progress-bar" />
          </div>

          {/* Current Step Content */}
          <div className="step-content">{renderCurrentStep()}</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MultiStepForm;
