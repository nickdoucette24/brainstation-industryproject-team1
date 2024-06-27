# Project: Spectra - delivered by Team 1


## Overview
Spectra helps monitor and ensure MSRP compliance across authorized retailers from an e-commerce perspective for Dell Technologies. It tracks and identifies non-compliant pricing with high accuracy and supports scalability for a growing array of products and retailer platforms.


### Problem
With the proliferation of streaming services, users often face the challenge of finding where a particular movie or show is available to stream. Additionally, deciding what to watch next and keeping track of scheduled viewing can be time-consuming and overwhelming. Endless scrolling and searching through various platforms add to the frustration. NextStream addresses these issues by informing users where content is available to stream and helping them plan their viewing schedule in advance.


### User Profile

## Features
- Continuous monitoring of product prices
- Detection of MSRP deviations
- Ranking of top offending products by retailer
- Dashboard for visualizing compliance data
- Alerts and notifications for non-compliant pricing

### Tech Stack
- Frontend
  - React.js
  - react-router-dom
  - Axios
  - Sass
- Backend
  - Node.js
  - Express.js
  - Knex
  - Python
- Database
  - MySQL
- Authentication
  - jsonwebtoken
  - bcrypt
- Utilities
  - cors
  - dotenv
  - uuid

### Landing Page
The Landing Page serves as the entry point to the application, providing a brief introduction and overview of the services offered. The page contains a 'Start Now' button which routes the user to the Authorization Page to log in or create an account.

### Authorization Page (Login / Register)
This page handles user authentication, offering both login and registration functionalities. It uses React.js for form handling and validation, Axios for making secure API post request with the login/register payload info, and jsonwebtoken stored in localStorage for managing user sessions. Passwords are securely hashed using bcrypt and stored along with the user data in a MySQL database.

### Navigation & Header
The Navigation and Header components provide a consistent user interface across the application. They include links to different pages, user account information, and are implemented using react-router-dom for seamless navigation. The alert's icon in the header routes directly to the Alert's notification tab. Each tab in the navigation routes directly to the selected page and applies conditional styling to the page list. Everything is functional and working.

### Product List Page
The Product List Page displays a list of products with their pricing details from different retailers. It uses React.js for state management and dynamic content updates, Axios for fetching data from the backend, and functional custom sorting and filtering logic to present the data efficiently, just click on each table header to sort that column. Pricing compliance and deviations are highlighted with specific styles using Sass. There is also an Export button at the bottom which is functional and will export a .csv file to the user's local machine.

### Account Settings Page
The Account Settings Page allows users to update their personal information and preferences. It includes form validation, secure data handling with Axios, and integrates with the backend to persist changes in the MySQL database. The page ensures user data security and integrity using jsonwebtoken for authentication and bcrypt for password management. This is also functional and you can successfully edit all user information from this page.