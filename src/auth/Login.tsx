import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import {
    IonAlert,
    IonButton, IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonIcon,
    IonInput, IonItem, IonLabel,
    IonLoading,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';
import {personCircle} from "ionicons/icons";

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  const handleLogin = () => {
    log('handleLogin...');
    login?.(username, password);
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: '/' }} />
  }
  return (
      <IonPage>
          <IonHeader>
              <IonToolbar>
                  <IonTitle>Login</IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent fullscreen className="ion-padding ion-text-center">
              <IonGrid>
                  <IonRow>
                      <IonCol>
                          <IonLoading isOpen={isAuthenticating}/>
                          <IonAlert
                              isOpen={authenticationError != null}
                              header={"Error!"}
                              message={'Username sau password gresite'}
                              buttons={["Dismiss"]}
                          />
                      </IonCol>
                  </IonRow>
                  <IonRow>
                      <IonCol>
                          <IonIcon style={{fontSize: "80px", color: "#0040ff"}}
                                   icon={personCircle}/>
                      </IonCol>
                  </IonRow>
                  <IonRow>
                      <IonCol>
                          <IonItem>
                              <IonLabel position="floating">Username</IonLabel>
                              <IonInput
                                  value={username}
                                  onIonChange={e => setState({
                                      ...state,
                                      username: e.detail.value || ''
                                  })}/>
                          </IonItem>
                      </IonCol>
                  </IonRow>

                  <IonRow>
                      <IonCol>
                          <IonItem>
                              <IonLabel position="floating">Password</IonLabel>
                              <IonInput
                                  type="password"
                                  value={password}
                                  onIonChange={e => setState({
                                      ...state,
                                      password: e.detail.value || ''
                                  })}/>
                          </IonItem>
                      </IonCol>
                  </IonRow>

                  <IonRow>
                      <IonCol>
                          <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
                      </IonCol>
                  </IonRow>
              </IonGrid>
          </IonContent>
      </IonPage>
  );
};
