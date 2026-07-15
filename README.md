# Oasis Notes - Website

## Overview

Oasis Notes is a comprehensive web application built with React.js that serves as an employee management and healthcare facility platform. The application provides various features for managing employee information, resident care, appointments, and medical documentation.

## 🚀 Features




- Employee Management
- Resident Management
- Appointment Scheduling
- Activity Scheduling
- Staff Scheduling
- Medical Documentation
- PDF Generation and Document Handling
- Employee Tracking
- Resident Tracking
- Employee Training
- Vitals Management
- Time sheet management
- Responsive Design
- Authentication and Authorization
- Chats

## 🛠️ Tech Stack

- **Frontend Framework:** React.js
- **Styling:**
  - Tailwind CSS
  - Bootstrap
- **State Management:** Redux Toolkit
- **Form Handling:**
  - Custom Form Components
  - Form Validation with React
- **Authentication & Authorization:**
  - JWT-based Authentication
  - Role-based Access Control
  - Secure Token Management
- **UI Components:**
  - React Calendar
  - React Select
  - FullCalendar
  - React Quill (Rich Text Editor)
- **Additional Tools:**
  - Axios for API calls
  - React Router for navigation
  - React PDF for document generation
  - **Containerization**: 
  - Docker, Nginx
- **Deployment**: 
  - Helm, Kubernetes, AWS ECR/EKS, GitHub Actions CI/CD

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create necessary environment variables (if required)

4. Start the development server:
   ```bash
   npm start
   ```

## 📝 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run dev` - Alias for npm start

## 🏗️ Project Structure

```
src/
├── admin/         # Admin-specific components and logic
├── assets/        # Static assets (images, fonts, etc.)
├── components/    # Reusable UI components
├── CSS/           # Global CSS styles
├── Layout/        # Layout components
├── Pages/         # Page components
├── resident/      # Resident-related components
├── Route/         # Routing configuration
├── store/         # Redux store setup and slices
├── utils/         # Utility functions
└── ...
```

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables (if needed):

```
React_App_Baseurl=your_api_url
```

## 🚢 Deployment

The application can be deployed using Docker:

1. Build the Docker image:

   ```bash
   docker build -t oasis-notes .
   ```

2. Run the container:
   ```bash
   docker run -p 80:80 oasis-notes
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.
