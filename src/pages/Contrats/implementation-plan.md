# Comprehensive Implementation Plan: Contract Details Functionality

## Overview
This plan outlines the steps needed to implement the contract details functionality for both enterprise and freelance users, including adding "Voir détails" buttons to contract lists and creating a dedicated details page.

## Implementation Steps

### 1. Create Contract Details Component

**File:** `src/pages/Contrats/DetailsContrat.jsx`

**Purpose:** Display comprehensive information about a contract

**Features:**
- Display contract title, description, and status
- Show parties involved (enterprise and freelancer)
- Present financial details (budget, payment terms)
- Show timeline information (start date, duration, end date)
- Include any attached documents
- Provide navigation back to the appropriate dashboard

**Implementation Pattern:** Follow the existing `DetailsAppel.jsx` component pattern using React Router's `useLocation()` hook to receive data.

### 2. Add Route in App.jsx

**File:** `src/App.jsx`

**Changes:**
- Import the new `DetailsContrat` component
- Add a new route: `<Route path="/details-contrat" element={<DetailsContrat />} />`
- Place this route in the "Contrats" section near the existing contract routes

### 3. Modify Enterprise Contracts List

**File:** `src/pages/DashboardEntreprise/components/ContratsList.jsx`

**Changes:**
- Add `useNavigate` import from 'react-router-dom'
- Add "Actions" column to the contracts table
- Add "Voir détails" button in each row with click handler
- Implement `handleViewDetails` function to navigate to the details page

### 4. Modify Freelance Contracts List

**File:** `src/pages/DashboardFreelance/components/ContratsListFreelance.jsx`

**Changes:**
- Add `useNavigate` import from 'react-router-dom'
- Add click handler to the existing "Voir détails" button
- Implement `handleViewDetails` function to navigate to the details page

### 5. Navigation Implementation

**Pattern:** 
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const handleViewDetails = (contract) => {
  navigate("/details-contrat", { state: contract });
};
```

**Data Flow:**
1. User clicks "Voir détails" button
2. `handleViewDetails` is called with the contract object
3. React Router navigates to `/details-contrat` with the contract data in the state
4. DetailsContrat component receives the data via `useLocation().state`
5. Contract details are displayed
6. User can navigate back to their dashboard

## Styling Consistency

Both "Voir détails" buttons should use consistent styling:
- Primary button style (blue background, white text)
- Small text size
- Rounded corners
- Hover effect

## Error Handling

The DetailsContrat component should handle cases where:
- No contract data is passed (show error message)
- Contract data is incomplete (gracefully handle missing fields)
- API calls for additional data fail (if needed)

## Testing Considerations

1. Verify that both enterprise and freelance users can access contract details
2. Ensure all contract information displays correctly
3. Test navigation back to dashboards works properly
4. Confirm consistent styling across both views
5. Validate error handling for missing or incomplete data