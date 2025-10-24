import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_CONFIG, getApiUrl } from '../../config/api';
import { ROUTES } from '../../config/routes';
import './Presentation.css';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface WelcomeCard {
  image: string;
  title: string;
  message: string;
}

interface WelcomeCardsResponse {
  cards: WelcomeCard[];
}

const Presentation: React.FC = () => {
  const history = useHistory();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cards, setCards] = useState<WelcomeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);

  // Cargar las tarjetas de bienvenida desde la API
  useEffect(() => {
    const fetchWelcomeCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          getApiUrl(API_CONFIG.ENDPOINTS.WELCOME_CARDS),
        );

        if (!response.ok) {
          throw new Error('Error al cargar las tarjetas de bienvenida');
        }

        const data: WelcomeCardsResponse = await response.json();
        setCards(data.cards);
      } catch (err) {
        console.error('Error al cargar las tarjetas:', err);
        setError('No se pudieron cargar las tarjetas de bienvenida');
        // En caso de error, usar tarjetas por defecto
        setCards([
          {
            image:
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            title: '¡Bienvenido a FitiPlus!',
            message:
              'Tu compañero perfecto para alcanzar tus objetivos de fitness.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcomeCards();
  }, []);

  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.activeIndex);
  };

  const handleNext = () => {
    if (currentSlide < cards.length - 1) {
      // Avanzar al siguiente slide usando la referencia del swiper
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    } else {
      // Ir a la página principal
      history.push(ROUTES.MULTI_STEP_FORM);
    }
  };

  const slideOptions = {
    modules: [Pagination],
    pagination: {
      clickable: true,
    },
    onSlideChange: handleSlideChange,
    onSwiper: (swiper: any) => {
      swiperRef.current = swiper;
    },
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <IonPage>
        <IonHeader></IonHeader>
        <IonContent className="presentation-content">
          <div
            className="presentation-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader></IonHeader>

      <IonContent className="presentation-content">
        <div className="presentation-container">
          {error && (
            <IonText
              color="warning"
              style={{ textAlign: 'center', padding: '10px' }}
            >
              <p>{error}</p>
            </IonText>
          )}

          <Swiper {...slideOptions} className="presentation-slides">
            {cards.map((card, index) => (
              <SwiperSlide key={index}>
                <div className="slide-content">
                  <IonCard className="presentation-card">
                    <IonCardHeader>
                      <div className="slide-image-container">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="slide-image"
                        />
                      </div>
                      <IonCardTitle className="slide-title">
                        {card.title}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText className="slide-description">
                        <p>{card.message}</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="presentation-controls">
            <div className="slide-indicators">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${
                    index === currentSlide ? 'active' : ''
                  }`}
                />
              ))}
            </div>

            <IonButton
              expand="block"
              onClick={handleNext}
              className="next-button"
            >
              {currentSlide === cards.length - 1 ? 'Comenzar' : 'Siguiente'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Presentation;
