import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const INITIAL_LATITUDE_DELTA = 0.0922;
const INITIAL_LONGITUDE_DELTA = 0.0421;

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

  useEffect(()=> {
    (async() => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      try {
        if (status !== 'granted') {
          setIsLoading(false);
          alert("Geolocation failed.");
          return;
        }
        const location = await Location.getLastKnownPositionAsync({accuracy: Location.Accuracy.High});
        const newLocation = [...markers, location.coords];
        setMarkers(newLocation);
        setIsLoading(false);
      } catch (error) {
        alert(error);
        setIsLoading(false);
      }
    })();
  }, []);

  const addMarker = (coords) => {
    const newLocation = [...markers, coords];
    setMarkers(newLocation);
  }

  const clearExtraMarkers = () => {
    const myLocation = [...markers.slice(0, 1)];
    setMarkers(myLocation);
  }

  if (isLoading) {
    return <View style={styles.container}><Text>Retrieving location...</Text></View>
  } else {
    return (
      <View style={styles.container}>
        <MapView 
          showsUserLocation={true}
          style={styles.map}
          initialRegion={{
            latitude: markers[0].latitude,
            longitude: markers[0].longitude,
            latitudeDelta: INITIAL_LATITUDE_DELTA,
            longitudeDelta: INITIAL_LONGITUDE_DELTA,
          }}
          onPress={(event) => addMarker(event.nativeEvent.coordinate)}
        >
          {markers.map((location, index) => (
            <Marker
              key={index} 
              title={(index + 1) + ". location"}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude }} />
          ))}
        </MapView>
        {markers.length > 1 &&
          <Button
            onPress={clearExtraMarkers}
            title="Clear extra markers"
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - Constants.statusBarHeight - 50,
    marginTop: 10,
    marginBottom: 10
  }
});