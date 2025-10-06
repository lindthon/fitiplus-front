import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';
import { FormData } from '../MultiStepForm';
import './FormStep3.css';

interface FormStep3Props {
  data: FormData;
  onSubmit: () => void;
  onPrev: () => void;
  onUpdate: (data: Partial<FormData>) => void;
}

const FormStep3: React.FC<FormStep3Props> = ({
  data,
  onSubmit,
  onPrev,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    diabetes: data.diabetes || false,
    hypertension: data.hypertension || false,
    highCholesterol: data.highCholesterol || false,
    allergy: data.allergy || false,
    allergyDescription: data.allergyDescription || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const healthConditions = [
    { key: 'diabetes', label: 'Diabetes' },
    { key: 'hypertension', label: 'Hipertensión' },
    { key: 'highCholesterol', label: 'Colesterol Alto' },
    { key: 'allergy', label: 'Alergia' },
  ];

  const handleHealthConditionChange = (condition: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [condition]: value,
      // Si se desmarca alergia, limpiar la descripción
      ...(condition === 'allergy' && !value ? { allergyDescription: '' } : {}),
    }));

    // Limpiar error cuando el usuario cambie
    if (errors[condition]) {
      setErrors((prev) => ({ ...prev, [condition]: '' }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Si tiene alergia, debe describir cuál
    if (formData.allergy && !formData.allergyDescription.trim()) {
      newErrors.allergyDescription = 'Describe qué tipo de alergia tienes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate(formData);
      onSubmit();
    }
  };

  const handlePrev = () => {
    onUpdate(formData);
    onPrev();
  };

  return (
    <IonCard className="form-step-card">
      <IonCardHeader>
        <IonCardTitle className="step-title">
          <IonText color="primary">
            <h2>Información de Salud</h2>
          </IonText>
          <IonText color="medium">
            <p>Cuéntanos sobre tu estado de salud actual</p>
          </IonText>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="form-fields">
          {healthConditions.map((condition) => (
            <div key={condition.key} className="health-condition-container">
              <IonText className="health-condition-label">
                <p>{condition.label}</p>
              </IonText>
              <div className="radio-options-container">
                <div
                  className={`radio-option ${
                    formData[condition.key as keyof typeof formData]
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    handleHealthConditionChange(condition.key, true)
                  }
                >
                  <IonCheckbox
                    checked={
                      formData[condition.key as keyof typeof formData] === true
                    }
                    onIonChange={() =>
                      handleHealthConditionChange(condition.key, true)
                    }
                  />
                  <IonLabel>Sí</IonLabel>
                </div>
                <div
                  className={`radio-option ${
                    formData[condition.key as keyof typeof formData] === false
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    handleHealthConditionChange(condition.key, false)
                  }
                >
                  <IonCheckbox
                    checked={
                      formData[condition.key as keyof typeof formData] === false
                    }
                    onIonChange={() =>
                      handleHealthConditionChange(condition.key, false)
                    }
                  />
                  <IonLabel>No</IonLabel>
                </div>
              </div>
              {errors[condition.key] && (
                <IonText color="danger" className="error-text">
                  {errors[condition.key]}
                </IonText>
              )}
            </div>
          ))}

          {/* Input para descripción de alergia - Solo si selecciona "Sí" en alergia */}
          {formData.allergy && (
            <IonItem className="form-input-item">
              <IonLabel position="stacked" style={{ marginBottom: '8px',fontSize: '1rem' }}>
                ¿Qué tipo de alergia tienes?
              </IonLabel>
              <IonInput
                type="text"
                value={formData.allergyDescription}
                onIonInput={(e) =>
                  handleInputChange('allergyDescription', e.detail.value || '')
                }
                placeholder="Describe tu alergia"
                className={errors.allergyDescription ? 'ion-invalid' : ''}
              />
              {errors.allergyDescription && (
                <IonText color="danger" className="error-text">
                  {errors.allergyDescription}
                </IonText>
              )}
            </IonItem>
          )}
        </div>

        <div className="form-actions">
          <IonButton
            fill="outline"
            onClick={handlePrev}
            className="prev-button"
          >
            Anterior
          </IonButton>
          <IonButton
            expand="block"
            onClick={handleSubmit}
            className="next-button"
          >
            Finalizar
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default FormStep3;
