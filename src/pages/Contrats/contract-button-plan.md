# Plan to Add "Voir Details" Buttons to Contract Lists

## Current State
1. Enterprise side (ContratsList.jsx) - No "voir details" button
2. Freelance side (ContratsListFreelance.jsx) - Has "Voir détails" button but no click handler

## Proposed Changes

### 1. Add "Voir Details" Button to Enterprise Contracts List (ContratsList.jsx)

In the table row rendering, add a new column with a "Voir détails" button:

```jsx
// Add a new table header
<th className="py-2 px-3">Actions</th>

// Add a new table cell in the row mapping
<td className="py-3 px-3">
  <button 
    onClick={() => handleViewDetails(contrat)}
    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-700"
  >
    Voir détails
  </button>
</td>
```

Add the `handleViewDetails` function:
```jsx
const navigate = useNavigate();

const handleViewDetails = (contract) => {
  navigate("/details-contrat", { state: contract });
};
```

### 2. Implement Click Handler for Freelance "Voir Details" Button

In ContratsListFreelance.jsx, add the navigation handler:

```jsx
const navigate = useNavigate();

// Add this function
const handleViewDetails = (contract) => {
  navigate("/details-contrat", { state: contract });
};

// Update the existing button to include onClick handler
<button 
  onClick={() => handleViewDetails(contract)}
  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-700"
>
  Voir détails
</button>
```

### 3. Required Imports

Both components will need:
```jsx
import { useNavigate } from 'react-router-dom';
```

### 4. Implementation Details

The button should:
- Be consistently styled between both views
- Use the same navigation pattern
- Pass the entire contract object as state
- Be placed in a logical location (next to other action buttons)