This README file provides an overview of the project, installation instructions, and other relevant information.

# Time-it

This project is a virtual time capsule built with React and TypeScript, using Redux for state management and Tailwind for styling. Users can create and view time capsules, which include titles, dates, and messages.

## Features

- **Create Time Capsules:** Users can create a new time capsule by providing a title, date, and message.
- **View Time Capsules:** Users can view a list of all created time capsules.
- **State Management:** Redux is used for managing the application state.
- **Form Handling:** Formik is used for handling form inputs.
- **Date Handling:** date-fns is used for manipulating and formatting dates.
- **Tailwind Styling:** Tailwind is used for styling components.
- **User Authentication and Database Storage:** FireBase is being used for User Auth and The Data is being stored in Firestore
- **File Upload:** Users can upload files to be stored within their time capsules.
- **File Download and Viewing:** Users can download files stored in their time capsules as a ZIP archive and also can click on the links to view them before downloading.


## Getting Started

### Prerequisites

- Node.js (>= 12.x)
- npm (>= 6.x) or yarn (>= 1.22.x)

## Tasks Done (Tasks to be Added as they are Completed) Project Completion 100%
- Basic Layout and Functionality on Local ✅
- Tailwind and Capsules Persist After Reload ✅
- Homepage Redesign and Firebase Integration with Authentication and Storage ✅
- File Upload is Possible Now ✅
- Transfering OwnerShip Has been Implemeneted. Requests are Approved by admin ✅

### Installation

1. Clone the repository:
 ```
 git clone https://github.com/your-username/virtual-time-capsule.git
 cd virtual-time-capsule
 ```
2. Install dependencies:
```
npm install
```
or
```
yarn install
```

3. Start the development server:
```
npm run dev
```
# or
```
yarn dev
```
Open your browser and navigate to http://localhost:3000 to see the application running.

# Libraries and Tools
React: JavaScript library for building user interfaces.
TypeScript: Typed superset of JavaScript that compiles to plain JavaScript.
Redux: State management library for JavaScript apps.
Formik: Library for building forms in React.
date-fns: Modern JavaScript date utility library.
CSS: Styling language used for describing the presentation of a document written in HTML or XML.

# Contributing
Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or new features to add.

# License
This project is licensed under the MIT License.
