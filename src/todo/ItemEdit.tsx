import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar, IonItem, IonLabel, IonModal, createAnimation, IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonIcon, IonActionSheet
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import { Photo, usePhotoGallery } from './usePhotoGallery';
import { camera, trash } from 'ionicons/icons';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [item, setItem] = useState<ItemProps>();
  const [showModal, setShowModal] = useState(false);
  const { photos, takePhoto, deletePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = createAnimation()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
  
      const wrapperAnimation = createAnimation()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' }
        ]);
  
      return createAnimation()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(1000)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    }
  
    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    }
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setDescription(item.description)
      setTitle(item.title)

    }
  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = item ? { ...item, description, title} : { description, title };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };
  log('render');
  return (
    <IonModal isOpen={true} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>

      <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg onClick={() => setPhotoToDelete(photo)}
                        src={photo.webviewPath}/>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}/>
          </IonFabButton>
        </IonFab>
        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[{
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              if (photoToDelete) {
                deletePhoto(photoToDelete);
                setPhotoToDelete(undefined);
              }
            }
          }]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />



        <IonItem>
          <IonLabel position="floating" >Denumire</IonLabel>
          <IonInput value={title} onIonChange={e => setTitle(e.detail.value || '')} />
          <IonLabel position="floating" >Descriere</IonLabel>
          <IonInput value={description} onIonChange={e => setDescription(e.detail.value || '')} />
        </IonItem>
        <IonInput value={description} onIonChange={e => setDescription(e.detail.value || '')} />
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default ItemEdit;
