# Workshops Frontend Flow

This document outlines the frontend flow for the workshops feature in the Sweet Lab Manager application.

## Overview

The workshop feature allows management of work groups that handle production or hourly-based tasks. Workshops can have multiple employees, track production records, hour records, and handle financial settlements.

## Architecture

### 1. Types (`src/types/workshops/`)

- **`workshop.type.ts`**: Contains all TypeScript interfaces and types for workshops
  - `Workshop`: Main workshop entity interface
  - `WorkshopHours`: Hour records for workshops
  - `WorkshopProduction`: Production records for workshops
  - `WorkshopSettlement`: Settlement records
  - `WorkshopFinancialSummary`: Financial summary data
  - DTOs for create/update operations

### 2. Services (`src/services/workshops/`)

- **`workshop.service.ts`**: API service layer for workshops
  - CRUD operations for workshops
  - Production tracking operations
  - Hours tracking operations
  - Settlement operations
  - Financial summary retrieval
  - Employee management in workshops

### 3. Hooks (`src/hooks/workshops/`)

- **`useWorkshops.ts`**: React Query hooks for state management
  - `useWorkshops()`: Fetch all workshops
  - `useWorkshop()`: Fetch specific workshop
  - `useCreateWorkshop()`: Create new workshop
  - `useUpdateWorkshop()`: Update existing workshop
  - `useAddWorkshopProduction()`: Add production record
  - `useAddWorkshopHours()`: Add hours record
  - `useCreateWorkshopSettlement()`: Create settlement
  - `useWorkshopFinancialSummary()`: Get financial summary
  - `useAddEmployeeToWorkshop()`: Add employee to workshop
  - `useRemoveEmployeeFromWorkshop()`: Remove employee from workshop

## API Endpoints

Based on the Postman screenshots, the following endpoints are available:

### Workshop Management

- `POST /workshops` - Create new workshop
- `GET /workshops` - Get all workshops
- `GET /workshops/:id` - Get specific workshop
- `PUT /workshops/:id` - Update workshop

### Production & Hours

- `POST /workshops/:id/production` - Add production record
- `POST /workshops/:id/hours` - Add hours record

### Settlement & Summary

- `POST /workshops/:id/settlement` - Create workshop settlement
- `GET /workshops/:id/summary` - Get financial summary (with date range params)

### Employee Management

- `POST /workshops/:id/employees/:employeeId` - Add employee to workshop
- `DELETE /workshops/:id/employees/:employeeId` - Remove employee from workshop

## Usage Example

```typescript
// In a React component
import { useWorkshops, useCreateWorkshop, useAddWorkshopProduction } from '@/hooks/workshops';
import { CreateWorkshopDTO } from '@/types/workshops';

function WorkshopManager() {
  // Fetch all workshops
  const { data: workshops, isLoading } = useWorkshops();

  // Create workshop mutation
  const createWorkshop = useCreateWorkshop({
    onSuccess: (data) => {
      console.log('Workshop created:', data);
    },
    onError: (error) => {
      console.error('Failed to create workshop:', error);
    }
  });

  // Add production record
  const addProduction = useAddWorkshopProduction({
    onSuccess: (data) => {
      console.log('Production added:', data);
    }
  });

  // Example: Create new workshop
  const handleCreateWorkshop = () => {
    const workshopData: CreateWorkshopDTO = {
      name: 'ورشة الحلويات',
      workType: 'production',
      password: '12345',
      notes: 'ورشة إنتاج الحلويات الشرقية'
    };

    createWorkshop.mutate(workshopData);
  };

  // Example: Add production record
  const handleAddProduction = (workshopId: number) => {
    const productionData = {
      date: new Date().toISOString(),
      items: [
        { itemId: 1, quantity: 100 },
        { itemId: 2, quantity: 50 }
      ],
      notes: 'إنتاج اليوم'
    };

    addProduction.mutate({ workshopId, data: productionData });
  };

  return (
    // Your UI components here
  );
}
```

## Integration Points

### With Employees Module

- Employees can be assigned to workshops
- Workshop type (hourly/production) determines how employee work is tracked
- Employee hours and production are recorded through workshops

### With Funds Module

- Workshop settlements transfer money to specific funds
- Settlement creates an invoice record

### With Invoices Module

- Settlement operations generate invoices
- Invoice category will be workshop-related

### With Items Module

- Production records track items produced
- Item production rates are used for calculations

## State Management

The workshop feature uses React Query for:

- Data fetching and caching
- Optimistic updates
- Automatic query invalidation after mutations
- Loading and error states

Query keys follow a consistent pattern:

- `['workshops']` - All workshops
- `['workshops', id]` - Specific workshop
- `['workshops', id, 'summary', params]` - Financial summary with filters

## Error Handling

All hooks provide standard error handling:

- Network errors are caught and passed to error callbacks
- API errors (4xx, 5xx) are properly formatted
- Toast notifications can be integrated through mutation callbacks

## Security Considerations

- Workshop operations require proper authentication
- Password field is required for workshop creation
- Role-based access control should be implemented for sensitive operations
- Financial data access should be restricted based on user permissions

## Workshop Operations Flow

### 1. Creating a Workshop

```typescript
const workshopData: CreateWorkshopDTO = {
  name: "ورشة الحلويات الشرقية",
  workType: "production", // or 'hourly'
  password: "secure_password",
  notes: "ورشة متخصصة في إنتاج الحلويات",
};

createWorkshop.mutate(workshopData);
```

### 2. Adding Employees to Workshop

```typescript
addEmployeeToWorkshop.mutate({
  workshopId: 1,
  employeeId: 5,
});
```

### 3. Recording Production

```typescript
const productionData: CreateWorkshopProductionDTO = {
  date: new Date().toISOString(),
  items: [
    { itemId: 10, quantity: 200 },
    { itemId: 15, quantity: 150 },
  ],
  notes: "إنتاج الوردية الصباحية",
};

addProduction.mutate({ workshopId: 1, data: productionData });
```

### 4. Recording Hours (for hourly workshops)

```typescript
const hoursData: CreateWorkshopHoursDTO = {
  employeeId: 5,
  hours: 8,
  hourlyRate: 5000,
  date: new Date().toISOString(),
  notes: "عمل إضافي",
};

addHours.mutate({ workshopId: 1, data: hoursData });
```

### 5. Creating Settlement

```typescript
const settlementData: CreateWorkshopSettlementDTO = {
  amount: 500000,
  fundId: 1,
  notes: "حسبة شهرية للورشة",
};

createSettlement.mutate({ workshopId: 1, data: settlementData });
```

### 6. Viewing Financial Summary

```typescript
const { data: summary } = useWorkshopFinancialSummary(workshopId, {
  startDate: "2025-01-01",
  endDate: "2025-01-31",
});
```

## Data Flow Diagram

```
User Action → Hook → Service → API → Backend
     ↓                              ↓
  UI Update ← React Query Cache ← Response
```

## Best Practices

1. **Use TypeScript Types**: Always use the defined interfaces and types
2. **Error Handling**: Implement proper error handling in mutation callbacks
3. **Loading States**: Show loading indicators during async operations
4. **Optimistic Updates**: Consider implementing optimistic updates for better UX
5. **Data Validation**: Validate user input before making API calls
6. **Role-Based Access**: Check user permissions before showing sensitive operations

## Future Enhancements

1. **Bulk Operations**: Add support for bulk production/hours entry
2. **Analytics Dashboard**: Create visual representations of workshop performance
3. **Export Functionality**: Add ability to export workshop data to Excel/PDF
4. **Notifications**: Implement real-time notifications for workshop activities
5. **Audit Trail**: Track all workshop operations for accountability
