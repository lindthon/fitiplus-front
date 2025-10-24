import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonLabel,
  IonSpinner,
  IonText,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { API_CONFIG, getApiUrl } from '../../../config/api';
import authService from '../../../services/AuthService';
import { FormData } from '../MultiStepForm';
import './FormStep3.css';

interface Allergy {
  id: string;
  name: string;
  description: string;
}

interface AllergiesResponse {
  allergies: Allergy[];
}

interface FormStep3Props {
  data: FormData;
  onSubmit: () => void;
  onPrev: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  title?: string;
  description?: string;
}

const FormStep3: React.FC<FormStep3Props> = ({
  data,
  onSubmit,
  onPrev,
  onUpdate,
  title = 'Información de Salud',
  description = 'Cuéntanos sobre tu estado de salud actual',
}) => {
  const [formData, setFormData] = useState({
    diabetes: data.diabetes || false,
    hypertension: data.hypertension || false,
    highCholesterol: data.highCholesterol || false,
    allergy: data.allergy || false,
    allergyDescription: data.allergyDescription || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [loadingAllergies, setLoadingAllergies] = useState(false);
  const [allergiesError, setAllergiesError] = useState<string | null>(null);

  const healthConditions = [
    { key: 'diabetes', label: 'Diabetes' },
    { key: 'hypertension', label: 'Hipertensión' },
    { key: 'highCholesterol', label: 'Colesterol Alto' },
    { key: 'allergy', label: 'Alergia' },
  ];

  // Inicializar alergias seleccionadas si ya existen
  useEffect(() => {
    if (data.allergyDescription && data.allergyDescription.trim()) {
      const savedAllergies = data.allergyDescription.split(',').filter(Boolean);
      setSelectedAllergies(savedAllergies);
    }
  }, [data.allergyDescription]);

  // Cargar las alergias cuando el usuario seleccione que tiene alergias
  useEffect(() => {
    if (formData.allergy && allergies.length === 0) {
      const fetchAllergies = async () => {
        try {
          console.log('🔬 [ALLERGIES] Iniciando carga de alergias...');
          setLoadingAllergies(true);
          setAllergiesError(null);

          const token = authService.getAuthToken();
          console.log(
            '🔑 [ALLERGIES] Token obtenido:',
            token ? 'Existe' : 'No existe',
          );

          if (!token) {
            throw new Error('No se encontró el token de autenticación');
          }

          const url = getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDING_ALLERGIES);
          console.log('🌐 [ALLERGIES] URL de consulta:', url);

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('📡 [ALLERGIES] Respuesta status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [ALLERGIES] Error en respuesta:', errorText);
            throw new Error('Error al cargar las alergias');
          }

          const data: AllergiesResponse = await response.json();
          console.log('📊 [ALLERGIES] Datos recibidos:', data);
          console.log('📊 [ALLERGIES] Alergias a cargar:', data.allergies);
          setAllergies(data.allergies);
        } catch (err) {
          console.error('💥 [ALLERGIES] Error al cargar alergias:', err);
          setAllergiesError('No se pudieron cargar las alergias');
          // En caso de error, usar alergias por defecto
          setAllergies([
            {
              id: 'lactose',
              name: 'Lactosa',
              description: 'Intolerancia a la lactosa',
            },
            {
              id: 'gluten',
              name: 'Gluten',
              description: 'Intolerancia o sensibilidad al gluten',
            },
            {
              id: 'nuts',
              name: 'Frutos secos',
              description: 'Alergia a frutos secos',
            },
          ]);
        } finally {
          setLoadingAllergies(false);
        }
      };

      fetchAllergies();
    }
  }, [formData.allergy, allergies.length]);

  const handleHealthConditionChange = (condition: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [condition]: value,
      // Si se desmarca alergia, limpiar las alergias seleccionadas
      ...(condition === 'allergy' && !value ? { allergyDescription: '' } : {}),
    }));

    // Si se desmarca alergia, limpiar las seleccionadas
    if (condition === 'allergy' && !value) {
      setSelectedAllergies([]);
    }

    // Limpiar error cuando el usuario cambie
    if (errors[condition]) {
      setErrors((prev) => ({ ...prev, [condition]: '' }));
    }
  };

  const handleAllergyToggle = (allergyId: string) => {
    setSelectedAllergies((prev) => {
      if (prev.includes(allergyId)) {
        return prev.filter((id) => id !== allergyId);
      } else {
        return [...prev, allergyId];
      }
    });

    // Limpiar error cuando el usuario seleccione
    if (errors.allergies) {
      setErrors((prev) => ({ ...prev, allergies: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Si tiene alergia, debe seleccionar al menos una
    if (formData.allergy && selectedAllergies.length === 0) {
      newErrors.allergies = 'Selecciona al menos una alergia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Guardar las alergias seleccionadas como string separado por comas
      const dataToSend = {
        ...formData,
        allergyDescription: selectedAllergies.join(','),
      };
      onUpdate(dataToSend);
      onSubmit();
    }
  };

  const handlePrev = () => {
    const dataToSend = {
      ...formData,
      allergyDescription: selectedAllergies.join(','),
    };
    onUpdate(dataToSend);
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

          {/* Lista de alergias - Solo si selecciona "Sí" en alergia */}
          {formData.allergy && (
            <div className="allergy-selection-container">
              <div className="allergy-label">
                <IonText>
                  <p>¿Qué tipo de alergia tienes?</p>
                </IonText>
              </div>

              {loadingAllergies ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <>
                  {allergiesError && (
                    <IonText
                      color="warning"
                      style={{
                        textAlign: 'center',
                        padding: '10px',
                        display: 'block',
                      }}
                    >
                      <p>{allergiesError}</p>
                    </IonText>
                  )}

                  <div className="allergies-list">
                    {allergies.map((allergy) => (
                      <div
                        key={allergy.id}
                        className="allergy-item-checkbox"
                        onClick={() => handleAllergyToggle(allergy.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedAllergies.includes(
                            allergy.id,
                          )
                            ? '#e8f4f8'
                            : 'transparent',
                        }}
                      >
                        <IonCheckbox
                          checked={selectedAllergies.includes(allergy.id)}
                          onIonChange={() => handleAllergyToggle(allergy.id)}
                          style={{ marginRight: '12px' }}
                        />
                        <IonLabel>
                          <h3 style={{ margin: 0, fontWeight: 500 }}>
                            {allergy.name}
                          </h3>
                        </IonLabel>
                      </div>
                    ))}
                  </div>

                  {errors.allergies && (
                    <IonText color="danger" className="error-text">
                      {errors.allergies}
                    </IonText>
                  )}
                </>
              )}
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
