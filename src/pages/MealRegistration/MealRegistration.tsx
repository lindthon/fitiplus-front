import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonTextarea,
} from '@ionic/react';
import { camera, close } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import './MealRegistration.css';

const MealRegistration: React.FC = () => {
  const [mealInput, setMealInput] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
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

  const handleRegister = () => {
    // Lógica para registrar la comida
    console.log('Registrando comida:', {
      meal: mealInput,
      ingredients: ingredientsInput,
      images: uploadedImages,
    });

    // Redirigir a la pantalla de generación de receta
    history.push(ROUTES.RECIPE_GENERATION);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding meal-registration-content">
        {/* Header */}
        <div className="registration-header">
          <h1 className="registration-title">Registra tu comida</h1>
        </div>

        {/* Image Upload Section */}
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
        <div className="manual-input-section">
          <h2 className="section-title">Ya comiste?, no hay problema</h2>
          <IonInput
            className="meal-input"
            placeholder="Escribe la comida que acabas de comer"
            value={mealInput}
            onIonInput={(e) => setMealInput(e.detail.value!)}
          />
        </div>

        {/* Ingredients Input Section */}
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

        {/* Register Button */}
        <div className="register-button-container">
          <IonButton
            className="register-button"
            fill="solid"
            onClick={handleRegister}
            disabled={!mealInput.trim() && !ingredientsInput.trim()}
          >
            Registrar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MealRegistration;
