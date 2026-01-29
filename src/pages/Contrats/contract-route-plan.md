# Plan to Add Contract Details Route

## Current State
The application has a route for contract creation (`/creation-contrat`) but no route for viewing contract details.

## Proposed Changes

### 1. Add Contract Details Component
Create a new component `DetailsContrat.jsx` in `src/pages/Contrats/` that will display detailed information about a contract.

### 2. Add Route in App.jsx
Add a new route for the contract details page:

```jsx
// Import the component
import DetailsContrat from './pages/Contrats/DetailsContrat';

// Add the route in the Routes section
<Route path="/details-contrat" element={<DetailsContrat />} />
```

This should be added in the "Contrats" section of the routes, around line 39, after the creation-contrat route.

### 3. Implementation Details
The contract details page should:
- Use `useLocation()` to receive contract data via React Router state
- Display comprehensive contract information including:
  - Contract title and description
  - Parties involved (enterprise and freelancer)
  - Financial details (budget, payment terms)
  - Timeline (start date, duration, end date)
  - Status with appropriate styling
  - Documents if any
- Include a back button to return to the appropriate dashboard

### 4. Navigation Pattern
Following the existing pattern from DetailsAppel:
- Use `useNavigate()` for navigation
- Pass contract data using state: `navigate("/details-contrat", { state: contractData })`
- Include a back button to return to the dashboard