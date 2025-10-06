import {
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import FormStep3 from './components/FormStep3';
import './MultiStepForm.css';

export interface FormData {
  // Información personal
  firstName: string;
  lastName: string;
  age: number;
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

interface MultiStepFormProps {
  initialData?: Partial<FormData>;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ initialData = {} }) => {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: 0,
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1
            data={formData}
            onNext={nextStep}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <FormStep2
            data={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <FormStep3
            data={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            onUpdate={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>

      <IonContent className="multi-step-form-content">
        <div className="form-container">
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
