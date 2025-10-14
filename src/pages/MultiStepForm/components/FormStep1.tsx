import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';
import { FormData } from '../MultiStepForm';
import './FormStep1.css';

interface FormStep1Props {
  data: FormData;
  onNext: () => void;
  onUpdate: (data: Partial<FormData>) => void;
}

const FormStep1: React.FC<FormStep1Props> = ({ data, onNext, onUpdate }) => {
  const [formData, setFormData] = useState({
    gender: data.gender || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { value: 'Reducir grasa corporal', label: 'Reducir grasa corporal' },
    { value: 'Ganar masa muscular', label: 'Ganar masa muscular' },
    { value: 'Mantener forma', label: 'Mantener forma' },
    { value: 'Mejorar resistencia', label: 'Mejorar resistencia' },
    { value: 'otro', label: 'Otro' },
  ];

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

  return (
    <IonCard className="form-step-card">
      <IonCardHeader>
        <IonCardTitle className="step-title">
          <IonText color="primary">
            <h2>Información Personal</h2>
          </IonText>
          <IonText color="medium">
            <p>Cuéntanos sobre ti para personalizar tu experiencia</p>
          </IonText>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="form-fields">
          <div className="gender-selection-container">
            <IonText className="gender-label">
              <p>¿Cuál es tu objetivo?</p>
            </IonText>
            <div className="gender-cards">
              {genderOptions.map((option) => (
                <div
                  key={option.value}
                  className={`gender-card ${
                    formData.gender === option.value ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <IonText className="gender-card-text">{option.label}</IonText>
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
