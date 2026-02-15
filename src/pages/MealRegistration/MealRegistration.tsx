import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/react';
import { camera, close } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_CONFIG, getApiUrl } from '../../config/api';
import { isFeatureEnabled } from '../../config/featureFlags';
import { ROUTES } from '../../config/routes';
import { authService } from '../../services/AuthService';
import './MealRegistration.css';

const MealRegistration: React.FC = () => {
  const [mealInput, setMealInput] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [inputMode, setInputMode] = useState<'photo' | 'text'>('photo');
  const history = useHistory();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImages((prev) => [...prev, file]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    // Lógica para registrar la comida
    console.log('Registrando comida:', {
      meal: mealInput,
      ingredients: ingredientsInput,
      images: uploadedImages,
      mode: inputMode,
    });

    const token =
      (authService.getAuthToken && authService.getAuthToken()) ||
      localStorage.getItem('fitiplus_token') ||
      '';

    try {
      let response: Response | null = null;

      if (inputMode === 'text') {
        // Preparar lista de ingredientes desde el textarea del usuario
        const ingredientsList = (ingredientsInput || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

        if (ingredientsList.length) {
          response = await fetch(
            getApiUrl(API_CONFIG.ENDPOINTS.RECIPE_GENERATION_ONLY_TEXT),
            {
              method: 'POST',
              headers: token
                ? {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  }
                : {
                    'Content-Type': 'application/json',
                  },
              body: JSON.stringify({ ingredients: ingredientsList }),
            },
          );
        }
      } else {
        // inputMode === 'photo'
        if (uploadedImages.length > 0) {
          const formData = new FormData();
          uploadedImages.forEach((file) => {
            formData.append('files', file);
          });

          response = await fetch(
            getApiUrl(API_CONFIG.ENDPOINTS.RECIPE_GENERATION_ONLY_IMAGES),
            {
              method: 'POST',
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : undefined,
              body: formData,
            },
          );
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        const recipeId = data?.recipeId || data?.matchedRecipe?.id || data?.id || null;
        // Guardar info para la siguiente vista
        localStorage.setItem(
          'generated_recipe_info',
          JSON.stringify({
            ...data,
            ingredients: inputMode === 'text' ? ingredientsInput : undefined,
            recipeId,
          }),
        );
      } else if (response) {
        console.error(
          'Error en generación de receta',
          response.status,
          await response.text().catch(() => ''),
        );
      }
    } catch (error) {
      console.error('Error llamando a generación de receta', error);
    }

    // Redirigir a la pantalla de generación de receta
    history.push(ROUTES.RECIPE_GENERATION);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding meal-registration-content">
        {/* Header */}
        <div className="registration-header">
          <h1 className="registration-title">Generar nueva receta</h1>
        </div>

        {/* Image Upload Section */}
        {/* Selector de modo */}
        <div className="manual-input-section">
          <h2 className="section-title">¿Cómo deseas subir los ingredientes?</h2>
          <IonSelect
            value={inputMode}
            onIonChange={(e) => setInputMode(e.detail.value as 'photo' | 'text')}
            interface="popover"
            className="mode-select"
          >
            <IonSelectOption value="photo">Subir fotos</IonSelectOption>
            <IonSelectOption value="text">Escribirlos</IonSelectOption>
          </IonSelect>
        </div>

        {isFeatureEnabled('showMealImageUpload') && inputMode === 'photo' && (
          <div className="image-upload-section">
            <div className="upload-card">
              <div className="upload-icon">
                <IonIcon
                  icon={camera}
                  style={{
                    fontSize: '80px',
                    width: '80px',
                    height: '80px',
                    '--size': '80px',
                  }}
                />
              </div>
              <p className="upload-text">Toma foto de lo que vas a comer</p>
              <p className="upload-formats">Formatos: PNG, JPEG</p>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageUpload}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-button">
                Agregar imagen
              </label>
            </div>
          </div>
        )}

        {/* Lista de imágenes subidas */}
        {uploadedImages.length > 0 && (
          <div className="uploaded-images-section">
            <h2 className="section-title">Imágenes subidas</h2>
            <div className="images-list">
              {uploadedImages.map((image, index) => (
                <div key={index} className="image-item">
                  <div className="image-preview">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Imagen ${index + 1}`}
                      className="preview-image"
                    />
                  </div>
                  <div className="image-info">
                    <span className="image-name">{image.name}</span>
                    <span className="image-size">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <IonButton
                    className="remove-button"
                    fill="clear"
                    onClick={() => removeImage(index)}
                  >
                    <IonIcon icon={close} />
                  </IonButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Meal Input Section */}
        {isFeatureEnabled('showMealManualInput') && (
          <div className="manual-input-section">
            <h2 className="section-title">Ya comiste?, no hay problema</h2>
            <IonInput
              className="meal-input"
              placeholder="Escribe la comida que acabas de comer"
              value={mealInput}
              onIonInput={(e) => setMealInput(e.detail.value!)}
            />
          </div>
        )}

        {/* Ingredients Input Section */}
        {inputMode === 'text' && (
          <div className="ingredients-section">
            <h2 className="section-title">Ingredientes (separados por coma)</h2>
            <IonTextarea
              className="ingredients-textarea"
              placeholder="Ej: Lechuga, papa, pollo, tomate, etc"
              value={ingredientsInput}
              onIonInput={(e) => setIngredientsInput(e.detail.value!)}
              rows={4}
            />
          </div>
        )}

        {/* Register Button */}
        <div className="register-button-container">
          <IonButton
            className="register-button"
            fill="solid"
            onClick={handleRegister}
            disabled={
              inputMode === 'text'
                ? !ingredientsInput.trim()
                : uploadedImages.length === 0
            }
          >
            Generar receta
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MealRegistration;
