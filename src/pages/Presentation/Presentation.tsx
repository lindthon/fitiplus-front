import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  fitnessOutline,
  heartOutline,
  starOutline,
} from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import './Presentation.css';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface SlideData {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
}

const Presentation: React.FC = () => {
  const history = useHistory();
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<any>(null);

  const slideData: SlideData[] = [
    {
      id: 1,
      title: '¡Bienvenido a FitiPlus!',
      description:
        'Tu compañero perfecto para alcanzar tus objetivos de fitness. Comienza tu transformación hoy mismo.',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      icon: 'fitness',
    },
    {
      id: 2,
      title: 'Ejercicios Personalizados',
      description:
        'Accede a rutinas de ejercicio diseñadas específicamente para ti, adaptadas a tu nivel y objetivos.',
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      icon: 'heart',
    },
    {
      id: 3,
      title: 'Seguimiento de Progreso',
      description:
        'Monitorea tu evolución con estadísticas detalladas y logros que te motivarán a seguir adelante.',
      image:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      icon: 'star',
    },
    {
      id: 4,
      title: 'Comunidad Fitness',
      description:
        'Conecta con otros usuarios, comparte tus logros y recibe apoyo de una comunidad motivada.',
      image:
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop',
      icon: 'checkmark',
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fitness':
        return fitnessOutline;
      case 'heart':
        return heartOutline;
      case 'star':
        return starOutline;
      case 'checkmark':
        return checkmarkCircleOutline;
      default:
        return fitnessOutline;
    }
  };

  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.activeIndex);
  };

  const handleNext = () => {
    if (currentSlide < slideData.length - 1) {
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

  return (
    <IonPage>
      <IonHeader></IonHeader>

      <IonContent className="presentation-content">
        <div className="presentation-container">
          <Swiper {...slideOptions} className="presentation-slides">
            {slideData.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="slide-content">
                  <IonCard className="presentation-card">
                    <IonCardHeader>
                      <div className="slide-image-container">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="slide-image"
                        />
                        <div className="slide-icon-overlay">
                          <IonIcon
                            icon={getIcon(slide.icon)}
                            className="slide-icon"
                          />
                        </div>
                      </div>
                      <IonCardTitle className="slide-title">
                        {slide.title}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText className="slide-description">
                        <p>{slide.description}</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="presentation-controls">
            <div className="slide-indicators">
              {slideData.map((_, index) => (
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
              {currentSlide === slideData.length - 1 ? 'Comenzar' : 'Siguiente'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Presentation;
