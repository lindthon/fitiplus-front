import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
} from '@ionic/react';
import { camera, create, flashOutline, images } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './IngredientSelection.css';

interface IngredientOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  selected: boolean;
}

const IngredientSelection: React.FC = () => {
  const history = useHistory();
  const [selectedOption, setSelectedOption] = useState<string>('gallery');

  const ingredientOptions: IngredientOption[] = [
    {
      id: 'camera',
      title: 'Tomar foto de tus ingredientes',
      description:
        'Captura una foto de los ingredientes que tienes disponibles',
      icon: camera,
      selected: false,
    },
    {
      id: 'gallery',
      title: 'Subir fotos desde galería',
      description: 'Selecciona fotos de ingredientes desde tu galería',
      icon: images,
      selected: true,
    },
    {
      id: 'write',
      title: 'Escriba sus ingredientes',
      description: 'Escribe manualmente los ingredientes que tienes',
      icon: create,
      selected: false,
    },
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    // Aquí puedes agregar la lógica para procesar la opción seleccionada
    console.log('Opción seleccionada:', selectedOption);
    // Por ahora, volvemos al Tab1
    history.push('/tabs/tab1');
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent className="ingredient-selection-content">
        <div className="ingredient-container">
          {/* Header */}
          <div className="ingredient-header">
            <h1 className="ingredient-title">
              Plan inteligente
              <IonIcon icon={flashOutline} className="title-icon" />
            </h1>
          </div>

          {/* Main Question */}
          <div className="main-question">
            <IonText>
              <h2>¿Qué tienes para cocinar hoy?</h2>
            </IonText>
          </div>

          {/* Options */}
          <div className="options-container">
            {ingredientOptions.map((option) => (
              <div
                key={option.id}
                className={`option-card ${
                  selectedOption === option.id ? 'selected' : ''
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="option-content">
                  <div className="option-icon">
                    <IonIcon icon={option.icon as any} />
                  </div>
                  <div className="option-text">
                    <h3 className="option-title">{option.title}</h3>
                    <p className="option-description">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="action-container">
            <IonButton
              expand="block"
              onClick={handleNext}
              className="next-button"
            >
              Siguiente
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IngredientSelection;
