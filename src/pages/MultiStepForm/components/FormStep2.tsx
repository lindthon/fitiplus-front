import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonText,
} from '@ionic/react';
import React, { useState } from 'react';
import { FormData } from '../MultiStepForm';
import './FormStep2.css';

interface FormStep2Props {
  data: FormData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: Partial<FormData>) => void;
}

const FormStep2: React.FC<FormStep2Props> = ({
  data,
  onNext,
  onPrev,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    weight: data.weight || 70,
    height: data.height || 170,
    age: data.age || 25,
    gender: data.gender || '',
    isPregnant: data.isPregnant || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error cuando el usuario empiece a cambiar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender,
      isPregnant: gender === 'femenino' ? prev.isPregnant : false, // Reset embarazo si no es femenino
    }));

    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'El peso debe estar entre 30 y 300 kg';
    }

    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'La altura debe estar entre 100 y 250 cm';
    }

    if (!formData.age || formData.age < 13 || formData.age > 100) {
      newErrors.age = 'La edad debe estar entre 13 y 100 años';
    }

    if (!formData.gender) {
      newErrors.gender = 'Selecciona tu género';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
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
            <h2>Información Personal</h2>
          </IonText>
          <IonText color="medium">
            <p>Completa tus datos básicos</p>
          </IonText>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="form-fields">
          {/* Peso Slider */}
          <div className="slider-container">
            <IonText className="slider-label">
              <p>Peso: {formData.weight} kg</p>
            </IonText>
            <IonRange
              min={30}
              max={300}
              step={1}
              value={formData.weight}
              onIonChange={(e) => handleInputChange('weight', e.detail.value)}
              className={errors.weight ? 'ion-invalid' : ''}
            >
              <IonLabel slot="start">30kg</IonLabel>
              <IonLabel slot="end">300kg</IonLabel>
            </IonRange>
            {errors.weight && (
              <IonText color="danger" className="error-text">
                {errors.weight}
              </IonText>
            )}
          </div>

          {/* Altura Slider */}
          <div className="slider-container">
            <IonText className="slider-label">
              <p>Altura: {formData.height} cm</p>
            </IonText>
            <IonRange
              min={100}
              max={250}
              step={1}
              value={formData.height}
              onIonChange={(e) => handleInputChange('height', e.detail.value)}
              className={errors.height ? 'ion-invalid' : ''}
            >
              <IonLabel slot="start">100cm</IonLabel>
              <IonLabel slot="end">250cm</IonLabel>
            </IonRange>
            {errors.height && (
              <IonText color="danger" className="error-text">
                {errors.height}
              </IonText>
            )}
          </div>

          {/* Edad Slider */}
          <div className="slider-container">
            <IonText className="slider-label">
              <p>Edad: {formData.age} años</p>
            </IonText>
            <IonRange
              min={13}
              max={100}
              step={1}
              value={formData.age}
              onIonChange={(e) => handleInputChange('age', e.detail.value)}
              className={errors.age ? 'ion-invalid' : ''}
            >
              <IonLabel slot="start">13</IonLabel>
              <IonLabel slot="end">100</IonLabel>
            </IonRange>
            {errors.age && (
              <IonText color="danger" className="error-text">
                {errors.age}
              </IonText>
            )}
          </div>

          {/* Género Radio Group */}
          <div className="radio-group-container">
            <IonText className="radio-group-label">
              <p>Género</p>
            </IonText>
            <IonRadioGroup
              value={formData.gender}
              onIonChange={(e) => handleGenderChange(e.detail.value)}
              className={errors.gender ? 'ion-invalid' : ''}
            >
              <IonItem button onClick={() => handleGenderChange('masculino')}>
                <IonRadio slot="start" value="masculino" />
                <IonLabel>Masculino</IonLabel>
              </IonItem>
              <IonItem button onClick={() => handleGenderChange('femenino')}>
                <IonRadio slot="start" value="femenino" />
                <IonLabel>Femenino</IonLabel>
              </IonItem>
            </IonRadioGroup>
            {errors.gender && (
              <IonText color="danger" className="error-text">
                {errors.gender}
              </IonText>
            )}
          </div>

          {/* Embarazo - Solo si es femenino */}
          {formData.gender === 'femenino' && (
            <div className="radio-group-container">
              <IonText className="radio-group-label">
                <p>¿Estás embarazada?</p>
              </IonText>
              <IonRadioGroup
                value={formData.isPregnant ? 'si' : 'no'}
                onIonChange={(e) =>
                  handleInputChange('isPregnant', e.detail.value === 'si')
                }
              >
                <IonItem
                  button
                  onClick={() => handleInputChange('isPregnant', true)}
                >
                  <IonRadio slot="start" value="si" />
                  <IonLabel>Sí</IonLabel>
                </IonItem>
                <IonItem
                  button
                  onClick={() => handleInputChange('isPregnant', false)}
                >
                  <IonRadio slot="start" value="no" />
                  <IonLabel>No</IonLabel>
                </IonItem>
              </IonRadioGroup>
            </div>
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

export default FormStep2;
