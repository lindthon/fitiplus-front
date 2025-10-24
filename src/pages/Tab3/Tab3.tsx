import {
  IonButton,
  IonContent,
  IonDatetime,
  IonIcon,
  IonModal,
  IonPage,
} from '@ionic/react';
import { calendar } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Tab3.css';

const Tab3: React.FC = () => {
  const history = useHistory();

  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // Estado para el modal del calendario
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Forzar zona horaria local
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Comparar solo las fechas (sin hora)
    const dateOnly = date.toDateString();
    const todayOnly = today.toDateString();
    const yesterdayOnly = yesterday.toDateString();

    if (dateOnly === todayOnly) {
      return 'Hoy';
    } else if (dateOnly === yesterdayOnly) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
  };

  // Función para ir al día anterior
  const goToPreviousDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    currentDate.setDate(currentDate.getDate() - 1);

    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const newDay = String(currentDate.getDate()).padStart(2, '0');
    setSelectedDate(`${newYear}-${newMonth}-${newDay}`);
  };

  // Función para abrir el calendario
  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  // Función para cerrar el calendario
  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  // Función para confirmar la fecha seleccionada
  const confirmDate = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  // Función para navegar al detalle de la receta
  const handleViewRecipe = (mealId: string) => {
    history.push(`/recipe/${mealId}`);
  };

  // Datos de comidas del día
  const mealHistory = [
    {
      id: 'arroz-pollo',
      name: 'Arroz con pollo',
      proteinas: 20,
      carbohidratos: 10,
      grasas: 30,
    },
    {
      id: 'pollo-champinones',
      name: 'Pollo con champiñones',
      proteinas: 14,
      carbohidratos: 58,
      grasas: 30,
    },
    {
      id: 'pollo-naranja',
      name: 'Pollo a la naranja',
      proteinas: 20,
      carbohidratos: 20,
      grasas: 20,
    },
    {
      id: 'lomo-cerdo',
      name: 'Lomo de cerdo',
      proteinas: 50,
      carbohidratos: 80,
      grasas: 55,
    },
  ];

  const nutrients = [
    { label: 'Proteinas', color: '#8b5cf6' },
    { label: 'Carbohidratos', color: '#3b82f6' },
    { label: 'Grasas', color: '#f59e0b' },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding tab3-content">
        {/* Header */}
        <div className="history-header">
          <h1 className="history-title">Historial de comidas</h1>
        </div>

        {/* Indicadores de color de nutrientes */}
        <div className="nutrient-indicators">
          {nutrients.map((nutrient, index) => (
            <div key={index} className="nutrient-indicator">
              <span className="nutrient-label">{nutrient.label}</span>
              <div
                className="nutrient-color-line"
                style={{ backgroundColor: nutrient.color }}
              ></div>
            </div>
          ))}
        </div>

        {/* Sección del día */}
        <div className="day-section">
          <div className="day-header">
            <h2 className="day-title">{formatDate(selectedDate)}</h2>
            <IonButton className="calendar-button" onClick={openCalendar}>
              <IonIcon slot="icon-only" icon={calendar} />
            </IonButton>
          </div>
        </div>

        {/* Lista de comidas */}
        <div className="meal-list">
          {mealHistory.map((meal, index) => (
            <div
              key={index}
              className="meal-card"
              onClick={() => handleViewRecipe(meal.id)}
            >
              <div className="meal-icon">
                <span className="meal-icon-symbol">🍲</span>
              </div>
              <div className="meal-info">
                <h3 className="meal-name">{meal.name}</h3>
                <div className="nutrient-badges">
                  <div
                    className="nutrient-badge proteinas"
                    style={{ backgroundColor: '#8b5cf6' }}
                  >
                    {meal.proteinas}g
                  </div>
                  <div
                    className="nutrient-badge carbohidratos"
                    style={{ backgroundColor: '#3b82f6' }}
                  >
                    {meal.carbohidratos}g
                  </div>
                  <div
                    className="nutrient-badge grasas"
                    style={{ backgroundColor: '#f59e0b' }}
                  >
                    {meal.grasas}g
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón día anterior */}
        <div className="previous-day-container">
          <IonButton
            className="previous-day-button"
            fill="solid"
            onClick={goToPreviousDay}
          >
            Día anterior
          </IonButton>
        </div>

        {/* Modal del calendario */}
        <IonModal isOpen={isCalendarOpen} onDidDismiss={closeCalendar}>
          <div className="calendar-modal">
            <div className="calendar-header">
              <h3>Seleccionar fecha</h3>
              <IonButton fill="clear" onClick={closeCalendar}>
                ✕
              </IonButton>
            </div>
            <div className="calendar-content">
              <IonDatetime
                value={selectedDate}
                onIonChange={(e) => confirmDate(e.detail.value as string)}
                presentation="date"
                locale="es-ES"
                className="calendar-datetime"
              />
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
