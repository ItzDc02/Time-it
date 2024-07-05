# Time-it

This README file provides an overview of the Time-it project, including installation instructions and other relevant information.

## Overview

Time-it is a virtual time capsule application built with React and TypeScript, using Redux for state management and Tailwind CSS for styling. Users can create, view, and manage time capsules, which include titles, dates, messages, and file attachments.

## Features

- **Create Time Capsules:** Users can create new time capsules by providing a title, date, message, and file attachments.
- **View Time Capsules:** Users can view a list of all created time capsules.
- **File Management:** Users can upload files to their time capsules, download files as a ZIP archive, and view files before downloading.
- **Transfer Ownership:** Users can transfer ownership of their time capsules to other users.
- **Admin Panel:** Admins can approve or deny transfer requests.
- **User Authentication:** Firebase Authentication is used for user management.
- **Database Storage:** Firestore is used for storing time capsule data.
- **State Management:** Redux is used for managing the application state.
- **Form Handling:** Formik is used for handling form inputs.
- **Date Handling:** date-fns is used for manipulating and formatting dates.
- **Styling:** Tailwind CSS is used for styling components.

## Getting Started

### Prerequisites

- Node.js (>= 12.x)
- npm (>= 6.x) or yarn (>= 1.22.x)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/time-it.git
    cd time-it
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Project Completion

- [x] Basic Layout and Functionality on Local
- [x] Tailwind and Capsules Persist After Reload
- [x] Homepage Redesign and Firebase Integration with Authentication and Storage
- [x] File Upload Implementation
- [x] Transfer Ownership Feature with Admin Approval System

## Libraries and Tools

- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Typed superset of JavaScript that compiles to plain JavaScript.
- **Redux:** State management library for JavaScript apps.
- **Formik:** Library for building forms in React.
- **date-fns:** Modern JavaScript date utility library.
- **Tailwind CSS:** Utility-first CSS framework for rapidly building custom designs.
- **Firebase:** Platform for building web and mobile applications.
- **Firestore:** NoSQL cloud database to store and sync data.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or new features to add.

## License

This project is licensed under the MIT License.
