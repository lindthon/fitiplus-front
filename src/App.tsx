import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, time, trophy } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import SimpleAuthCheck from './components/SimpleAuthCheck';
import { ROUTES } from './config/routes';
import IngredientSelection from './pages/IngredientSelection';
import Login from './pages/Login';
import MultiStepForm from './pages/MultiStepForm';
import Presentation from './pages/Presentation';
import RecipeDetail from './pages/RecipeDetail';
import Register from './pages/Register';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path={ROUTES.LOGIN}>
          <Login />
        </Route>
        <Route exact path={ROUTES.REGISTER}>
          <Register />
        </Route>
        <Route exact path={ROUTES.PRESENTATION}>
          <Presentation />
        </Route>
        <Route exact path={ROUTES.MULTI_STEP_FORM}>
          <MultiStepForm />
        </Route>
        <Route exact path="/recipe/:id">
          <SimpleAuthCheck>
            <RecipeDetail />
          </SimpleAuthCheck>
        </Route>
        <Route exact path={ROUTES.INGREDIENT_SELECTION}>
          <SimpleAuthCheck>
            <IngredientSelection />
          </SimpleAuthCheck>
        </Route>
        <Route path={ROUTES.TABS}>
          <SimpleAuthCheck>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path={ROUTES.TAB1}>
                  <Tab1 />
                </Route>
                <Route exact path={ROUTES.TAB2}>
                  <Tab2 />
                </Route>
                <Route path={ROUTES.TAB3}>
                  <Tab3 />
                </Route>
                <Route exact path={ROUTES.TABS}>
                  <Redirect to={ROUTES.TAB1} />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href={ROUTES.TAB1}>
                  <IonIcon aria-hidden="true" icon={home} />
                  <IonLabel>Tab 1</IonLabel>
                </IonTabButton>

                <IonTabButton tab="tab3" href={ROUTES.TAB3}>
                  <IonIcon aria-hidden="true" icon={time} />
                  <IonLabel>Tab 3</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href={ROUTES.TAB2}>
                  <IonIcon aria-hidden="true" icon={trophy} />
                  <IonLabel>Tab 2</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </SimpleAuthCheck>
        </Route>
        <Route exact path={ROUTES.ROOT}>
          <Redirect to={ROUTES.LOGIN} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
