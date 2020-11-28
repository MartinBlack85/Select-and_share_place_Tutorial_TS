
// using 3rd party library axios for handling HTTP requests to API
import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = '';

// setting a global variable
// declare var google: any;

// creating a custom type for the get() request:
type GeoCodeResponse = { 
    results: { 
        geometry: { 
            location: { 
                lat: number, lngt: number } 
            } 
        }[]; 
    // for the google api status response
    status: 'OK' | 'ZERO_RESULTS';
};
    

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    // send it to the Google API
    // sending a get request to a url
    // get() is an async task, needs a then() for successful request and a catch() for passibel error handling
    // since get() is generic method, we ca define a custom type as the first generic type
    axios.get<GeoCodeResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(response => {
        if(response.data.status !== 'OK') {
            throw new Error('Could not find location');
        }
        const coordinates = response.data.results[0].geometry.location;
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: coordinates,
            zoom: 16,
        });

        new google.maps.Marker({
            position: coordinates,
            map: map,
        });
        
        
    })
    .catch(err => {
        alert(err.message);
        console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);