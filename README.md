# Social Web App

## Overview

This project is a responsive web application for a social platform. Users can log in, register, create posts, view profiles, and engage in various social interactions. The application is built using HTML, CSS (utilizing Bootstrap for styling), and JavaScript. Axios is employed for making HTTP requests to facilitate seamless communication with the server.

## Technologies Used

- HTML
- CSS (Bootstrap for styling)
- JavaScript
- Axios for making HTTP requests

## Demo

[Explore Template](https://social-web-appp.netlify.app/)

## How to Run

1. Clone the repository: `git clone <repository-url>`
2. Open `index.html` in a web browser.

## Features

- **Navigation Bar**: Provides easy navigation between home and profile pages.
- **Authentication**: Users can log in and register using modals.
- **Create and View Posts**: Users can create new posts, and existing posts are dynamically displayed.
- **Profile Section**: User profiles are displayed with their posts.
- **Modals**: Various modals for actions like login, registration, creating posts, editing posts, and deleting posts.
- **Alerts**: Displays alerts for notifications or messages.
- **Loader**: A loading spinner appears during data fetching or processing.

## User Authentication with Local Storage

To ensure user authorization, the application uses local storage to store a JSON Web Token (JWT) upon successful login or registration. This token is then included in the headers of HTTP requests to secure endpoints on the server.

Here's a brief overview of how local storage is used:

1. **Login**: When a user logs in, a JWT is obtained from the server. This token is then stored in the local storage.
2. **Registration**: Similarly, during registration, a JWT is obtained, and it's stored in the local storage.
3. **Token Usage**: The stored token is included in the headers of requests to authorized endpoints. This ensures that the server can verify the user's identity and grant access accordingly.

## Project Structure

- `index.html`: The main HTML file for the web application.
- `css/`: Directory containing stylesheets, including Bootstrap.
- `js/`: Directory containing JavaScript files.
  - `Main.js`: Main script for handling common functionalities.
  - `Home.js`: Script for home page functionality.
  - `Profile.js`: Script for profile page functionality.
  - `PostDetails.js`: Script for post details page functionality.
- `images/`: Directory for Default Profile image only used in the App.

## Usage

- Navigate to the home page (`Home.html`) and explore the features.
- Click on the "Profile" link to view and interact with user profiles.
- Use the login and registration modals to access authenticated features.
- Create, edit, and delete posts using the respective modals.
