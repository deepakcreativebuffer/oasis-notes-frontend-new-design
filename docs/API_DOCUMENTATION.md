# OasisNotes API Documentation

## Overview
The OasisNotes Employee application interfaces with the backend via a centralized set of API constants defined in `src/serviceAPI/apis/`. This modular architecture prevents hardcoded strings within React components and allows for dynamic URL generation through templated functions.

## Base Configuration
The base API instance is configured in `src/serviceAPI/baseApi.js` and leverages Axios. 

**Default Configuration:**
- Base URL is determined by the environment variable `REACT_APP_URL` or defaults to `/`.
- Credentials (`withCredentials: true`) are passed with every request for authentication.
- Request timeout is globally enforced to 15 seconds unless overridden.

**Global Interceptors:**
1. **Request Interceptor:** 
   - Rejects requests if offline.
   - Attaches `timezone` and `organization` headers based on Redux state.
2. **Response Interceptor:**
   - Logs `ERR_CANCELED` for aborted requests.
   - Detects 401 Unauthorized responses to trigger global logout routines.

## API Modules

### 1. Authentication APIs (`authApis.js`)
Handles OTP generation, login, verification, and password recovery.
- `OTP_CHALLENGE`: Initiates login OTP.
- `OTP_VERIFY_CHALLENGE`: Verifies OTP payload.
- `FORGET_PASSWORD`: Triggers password reset sequence.

### 2. Employee APIs (`employeeApis.js`)
Manages the employee dashboard, profile, notes, and direct patient interaction data.
- `DASHBOARD_STATS`: Aggregated metrics.
- `GET_PATIENT_LIST`: Employee's assigned patients.
- `SHIFT_GET_ALL(facilityId)`: Retrieves shift schedules dynamically.

### 3. Admin APIs (`adminApis.js`)
Endpoints reserved for administrative roles (managing staff, approvals, overarching facility settings).
- `STAFF_SCHEDULE_ADMIN_GET`: Complete organizational schedule visibility.
- `DELETE_TIME_OFF_REQUEST(id)`: Administrative override for time-off requests.

### 4. Resident/Patient APIs (`residentApis.js`)
CRUD operations regarding resident clinical data, assessments, and vitals.
- `PATIENT_GETPATIENTDETAILS(id)`: Retrieves complete chart for a patient.
- `PATIENT_CREATEAPPOINTMENT`: Books an appointment for the resident.

### 5. Common APIs (`commonApis.js`)
Cross-cutting endpoints used across multiple views (like reference data or lookup tables).

## Usage Example

```javascript
import { EMPLOYEE_APIS } from "../../serviceAPI";
import api from "../../serviceAPI/baseApi";
import { handleApiRequest } from "../../serviceAPI/core/errorHandler";
import logger from "../../utils/logger";

const fetchShifts = async (facilityId) => {
  const result = await handleApiRequest(
    () => api.get(EMPLOYEE_APIS.SHIFT_GET_ALL(facilityId)),
    "Fetch All Shifts"
  );

  if (result.success) {
    return result.data;
  } else {
    // Error is automatically formatted by handleApiRequest
    logger.error(result.message);
  }
};
```
