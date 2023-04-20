import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AllLocations from './pages/AllLocations';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationPage from './pages/LocationPage';
import ItemPage from './pages/ItemPage';
import { getData } from '../utilities/apiUtilities';
import { useEffect, useState } from 'react';


const App = () => {
  const [locationsMetadata, setLocationsMetadata] = useState(null);
  useEffect(() => {
    getData('metadata').then(response => {
      setLocationsMetadata(response);
      console.log(response);
    })
  }, []);  

  // const locationsMetadata = {
  //   "Sargent": {
  //     "name": "Sargent",
  //     "averageRating": 4.5,
  //     "topItem": "Tenders",
  //     "imageLink": "placeholderurl"
  //   },
  //   "Elder": {
  //     "name": "Elder",
  //     "averageRating": 3.6,
  //     "topItem": "Burders",
  //     "imageLink": "placeholderurl2"
  //   }
  // };
  // console.log(Object.entries(data.locations));
  return (
    <div>
    {locationsMetadata ?
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllLocations data={locationsMetadata} />} />
          {Object.entries(locationsMetadata).map(([key, value]) => (
            <Route 
              path={`${key}`} 
              key={`${key}`} 
              element={
                <LocationPage 
                  locationName={key.charAt(0).toUpperCase() + key.slice(1)}
                />} 
            />))
          }
          <Route 
            path={`/items/:locationName/:id`}
            element={<ItemPage />}
          />
        </Routes>
      </BrowserRouter>  
    : 'Loading data, please hang tight! 🫶'}
    </div>
  );
};

export default App;
