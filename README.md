# Nearby-Hospital-Locator
The Nearby Hospital Locator is a web application designed to help users locate hospitals near their current location or a specified address. The app uses geolocation, mapping APIs, and reverse geocoding to display nearby hospitals with their distances and addresses on an interactive map. It also provides an option to book an appointment at a selected hospital.

**Features**

Search by Current Location:
Uses the browser's geolocation API to fetch the user's current location.
Displays hospitals within a 5 km radius.

Search by Address:
Allows users to enter an address manually to find nearby hospitals.
Uses OpenCage API for geocoding.

Interactive Map:
Displays the user's location and nearby hospitals on an OpenStreetMap-powered map.
Shows details such as hospital name, distance, and address when markers are clicked.

Hospital Details:
Lists hospitals in a card-based format with their details.
Option to "Book Appointment" for each hospital.

**Technologies Used**

**Frontend:**
React: Framework for building the application UI.
React-Leaflet: For integrating OpenStreetMap with React.
Leaflet: JavaScript library for interactive maps.

**APIs:**
Geoapify Places API:
Used to fetch nearby hospitals within a given radius.

OpenCage Geocoding API:
Used to convert addresses into geographical coordinates.

OpenStreetMap Nominatim API:
For reverse geocoding to fetch hospital addresses from coordinates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

