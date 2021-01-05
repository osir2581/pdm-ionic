import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonCard,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding,
  IonLabel,
  IonList, IonLoading,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {add, trash} from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext, ItemProvider } from './ItemProvider';
import { useAppState } from './useAppState';
import { useNetwork } from './useNetwork';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemList');


const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, deleteItem } = useContext(ItemContext);
  const [searchItem, setSearchItem] = useState<string>('');
  const [filter, setFilter] = useState<string | undefined>(undefined);
  var filter_criteria= new Array();
  const deleteRecipe = (id?: string) => {
    let recipe = items?.find(t => t._id == id)
    if (recipe)
      if (deleteItem) {
        deleteItem(recipe).then(r => {
          
        })
      }
  }
  log('render');
  const { appState } = useAppState();
  const { networkStatus } = useNetwork();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonLabel color="primary" id="ionlabel"> {networkStatus.connected?  "Online" : ""}</IonLabel>
          <IonLabel color="danger" id="ionlabel"> {!networkStatus.connected?  "Offline" : ""}</IonLabel>
          <IonTitle  color="primary">Retete</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonSearchbar
          value={searchItem}
          debounce={100}
          onIonChange={e => setSearchItem(e.detail.value!)}>
      </IonSearchbar>
        <IonLoading isOpen={fetching} message="Fetching items"/>
        {items &&  (
        <IonContent>
            <IonSelect value={filter} placeholder="Select Denumire" onIonChange={e => setFilter(e.detail.value)}>
            <IonSelectOption key={"None"} value={null}>
              All Filtered Items
            </IonSelectOption>
            {items
          .sort((a,b) => {
            return a.title.localeCompare(b.title)
          })
          .map(participant => {
            if(!filter_criteria.includes(participant.title)){
              filter_criteria.push(participant.title);
              return <IonSelectOption key={participant._id} value={participant.title}>
              {participant.title}
            </IonSelectOption>
            }
          }
          )}
           </IonSelect>  
          <IonList>
            {items
            .filter(item => item.title.indexOf(searchItem) >= 0)
            .filter(it => filter ? it.title == filter : it)
            .map(({ _id, description, title}) =>
                <IonItemSliding key={_id}>
                  <IonItemOptions side="start">
                    <IonItemOption color="danger" onClick={() => deleteRecipe(_id)}><IonIcon slot="start" icon={trash}/></IonItemOption>
                  </IonItemOptions>
                  <IonItem>
                    <Item key={_id} _id={_id} description={description} title={title}  onEdit={id => history.push(`/item/${id}`)} />
                  </IonItem>
                </IonItemSliding>
            )}
          </IonList>
          </IonContent>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
