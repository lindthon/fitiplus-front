import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
  IonItem,
  IonLabel,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import React, { useRef, useState } from 'react';
import { FormData } from '../MultiStepForm';
import './FormStep2.css';

interface FormStep2Props {
  data: FormData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  title?: string;
  description?: string;
}

const FormStep2: React.FC<FormStep2Props> = ({
  data,
  onNext,
  onPrev,
  onUpdate,
  title = 'Información Personal',
  description = 'Completa tus datos básicos',
}) => {
  const [formData, setFormData] = useState({
    weight: data.weight || 70,
    height: data.height || 170,
    dateOfBirth: data.dateOfBirth || '',
    gender: data.gender || '',
    isPregnant: data.isPregnant || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const modalRef = useRef<HTMLIonModalElement>(null);

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

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Selecciona tu fecha de nacimiento';
    } else {
      // Validar que la persona tenga al menos 13 años
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (actualAge < 13) {
        newErrors.dateOfBirth = 'Debes tener al menos 13 años';
      } else if (actualAge > 120) {
        newErrors.dateOfBirth = 'Por favor verifica tu fecha de nacimiento';
      }
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
            <h2>{title}</h2>
          </IonText>
          <IonText color="medium">
            <p>{description}</p>
          </IonText>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="form-fields">
          {/* Peso Picker */}
          <div className="picker-container">
            <IonItem className="picker-item">
              <IonLabel position="stacked">Peso (kg)</IonLabel>
              <IonSelect
                value={formData.weight}
                interface="action-sheet"
                placeholder="Selecciona tu peso"
                onIonChange={(e) => handleInputChange('weight', e.detail.value)}
                className={errors.weight ? 'ion-invalid' : ''}
              >
                {Array.from({ length: 271 }, (_, i) => i + 30).map((weight) => (
                  <IonSelectOption key={weight} value={weight}>
                    {weight} kg
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            {errors.weight && (
              <IonText color="danger" className="error-text">
                {errors.weight}
              </IonText>
            )}
          </div>

          {/* Altura Picker */}
          <div className="picker-container">
            <IonItem className="picker-item">
              <IonLabel position="stacked">Altura (cm)</IonLabel>
              <IonSelect
                value={formData.height}
                interface="action-sheet"
                placeholder="Selecciona tu altura"
                onIonChange={(e) => handleInputChange('height', e.detail.value)}
                className={errors.height ? 'ion-invalid' : ''}
              >
                {Array.from({ length: 151 }, (_, i) => i + 100).map(
                  (height) => (
                    <IonSelectOption key={height} value={height}>
                      {height} cm
                    </IonSelectOption>
                  ),
                )}
              </IonSelect>
            </IonItem>
            {errors.height && (
              <IonText color="danger" className="error-text">
                {errors.height}
              </IonText>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="picker-container">
            <div
              className="picker-item"
              onClick={() => setShowDatePicker(true)}
              style={{
                cursor: 'pointer',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <IonLabel
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#666',
                  marginBottom: '4px',
                }}
              >
                Fecha de Nacimiento
              </IonLabel>
              <IonText
                style={{
                  fontSize: '16px',
                  color: formData.dateOfBirth ? '#000' : '#999',
                }}
              >
                {formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Selecciona tu fecha de nacimiento'}
              </IonText>
            </div>
            {errors.dateOfBirth && (
              <IonText color="danger" className="error-text">
                {errors.dateOfBirth}
              </IonText>
            )}

            <IonModal
              ref={modalRef}
              isOpen={showDatePicker}
              onDidDismiss={() => setShowDatePicker(false)}
              breakpoints={[0, 0.75]}
              initialBreakpoint={0.75}
            >
              <div
                style={{
                  padding: '20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#333',
                    }}
                  >
                    Selecciona tu fecha de nacimiento
                  </h2>
                </div>
                <IonDatetime
                  presentation="date"
                  value={formData.dateOfBirth}
                  onIonChange={(e) => {
                    if (e.detail.value) {
                      handleInputChange('dateOfBirth', e.detail.value);
                    }
                  }}
                  max={new Date().toISOString()}
                  min={new Date(
                    new Date().getFullYear() - 120,
                    0,
                    1,
                  ).toISOString()}
                  locale="es-ES"
                  showDefaultButtons={false}
                  style={{
                    width: '100%',
                    '--background': '#fff',
                    '--border-radius': '12px',
                  }}
                />
                <div
                  style={{
                    marginTop: '24px',
                    display: 'flex',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e0e0e0',
                  }}
                >
                  <button
                    onClick={() => setShowDatePicker(false)}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      border: '2px solid #5260ff',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: '#5260ff',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f2ff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (formData.dateOfBirth) {
                        setShowDatePicker(false);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#5260ff',
                      color: 'white',
                      cursor: formData.dateOfBirth ? 'pointer' : 'not-allowed',
                      opacity: formData.dateOfBirth ? 1 : 0.5,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      if (formData.dateOfBirth) {
                        e.currentTarget.style.backgroundColor = '#3d4ecc';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (formData.dateOfBirth) {
                        e.currentTarget.style.backgroundColor = '#5260ff';
                      }
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </IonModal>
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
