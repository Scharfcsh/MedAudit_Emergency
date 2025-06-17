# MedAudit Emergency Patient Profile

## Overview
This Next.js application displays patient medical information in emergency situations. It fetches patient data from the MedAudit API using session tokens for secure access.

## Features
- **Dynamic Session Token Support**: Pass different session tokens via URL parameters
- **API Integration**: Fetches real patient data from `https://medaudit.onrender.com/api/ehr/nfc/session/{sessionToken}/documents/`
- **Responsive Design**: Works on all devices
- **Loading States**: Shows loading indicators while fetching data
- **Error Handling**: Displays appropriate error messages for failed requests
- **Emergency Access UI**: Clear indication of emergency access level

## Usage

### Default Session
Access the application without parameters to use the default session:
```
http://localhost:3000/
```

### Custom Session Token
Pass a session token via URL parameter:
```
http://localhost:3000/?session=YOUR_SESSION_TOKEN_HERE
```

### Example with Session Token
```
http://localhost:3000/?session=uO3eV9376ixkeb4THRFAhhTAVGPiE4wYmkfb3HJ_FXY
```

## Development

### Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Integration
The application makes a POST request to:
```
https://medaudit.onrender.com/api/ehr/nfc/session/{sessionToken}/documents/
```

The API response should include:
- Patient personal information
- Medical history
- Emergency contacts
- Insurance details
- Medical documents
- Session information

### Error Handling
The application handles various error scenarios:
- Network errors
- Invalid session tokens
- Missing patient data
- API server errors

## Components Structure
- `page.js` - Main page that imports the wrapper
- `components/PatientProfileWrapper.js` - Handles Suspense boundary for search params
- `components/PatientProfile.js` - Main component with data fetching and UI

## Technologies Used
- Next.js 14+ (App Router)
- React 18+
- Tailwind CSS
- Lucide React (Icons)
