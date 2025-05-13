# Sweet Lab Hooks Invalidation Strategy

This document explains the comprehensive invalidation strategy for the Sweet Lab project, ensuring data consistency across all related queries when mutations occur.

## Core Principles

1. **Cascade Invalidation**: When a mutation affects data, we invalidate not only the direct query but all related queries that might display or depend on that data.

2. **Granular Invalidation**: Where possible, invalidate specific queries (with IDs) before invalidating broader collections.

3. **Cross-Domain Effects**: Understand that many entities are interconnected (e.g., invoices affect customers, funds, shifts, and debts).

## Entity Relationships

### Customers
- Related to: Invoices, Debts, Customer Categories
- When modified, invalidate:
  - `["customers"]`
  - `["all-customers"]`
  - `["customer-summary", customerId]`
  - `["invoices"]` (customers have invoices)
  - `["currentInvoices"]`
  - `["debtsTracking"]` (customers can have debts)

### Invoices
- Related to: Customers, Items, Funds, Shifts, Debts
- When modified, invalidate:
  - `["invoice", invoiceId]`
  - `["invoices"]`
  - `["currentInvoices"]`
  - `["shiftSummary"]`
  - `["shiftInvoices"]`
  - `["funds"]` (invoices affect fund balances)
  - `["customer-summary"]` (customers see their invoices)
  - `["debtsTracking"]` (some invoices become debts)
  - `["items"]` (invoices contain items)

### Items
- Related to: Invoices, Item Groups
- When modified, invalidate:
  - `["items", itemId]`
  - `["items"]`
  - `["itemGroups"]`
  - `["invoices"]` (invoices contain items)
  - `["currentInvoices"]`

### Debts
- Related to: Customers, Invoices, Funds
- When modified, invalidate:
  - `["debtsTracking"]`
  - `["emplDebtsTracking"]`
  - `["invoices"]` (debts originate from invoices)
  - `["currentInvoices"]`
  - `["customer-summary"]` (shows customer debts)
  - `["funds"]` (debt payments affect funds)
  - `["shiftSummary"]`
  - `["shiftInvoices"]`

### Shifts
- Related to: Invoices, Funds, Transfers
- When modified, invalidate:
  - `["shifts"]`
  - `["shiftSummary"]`
  - `["shiftInvoices"]`
  - `["currentInvoices"]`
  - `["funds"]` (shifts handle fund movements)
  - `["checkingPendingTransfers"]`
  - `["pendingTransfers"]`
  - `["transferHistory"]`
  - `["invoices"]` (invoices are tied to shifts)

### Funds
- Related to: Invoices, Shifts, Transfers
- When modified, invalidate:
  - `["funds"]`
  - `["shiftSummary"]`
  - `["shiftInvoices"]`
  - `["transferHistory"]`
  - `["currentInvoices"]`
  - `["pendingTransfers"]`
  - `["checkingPendingTransfers"]`

## Implementation Examples

### Creating a Customer
```typescript
onSuccess: () => {
  // Direct queries
  queryClient.invalidateQueries({ queryKey: ["customers"] });
  queryClient.invalidateQueries({ queryKey: ["all-customers"] });
  
  // Related queries
  queryClient.invalidateQueries({ queryKey: ["invoices"] });
  queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
  queryClient.invalidateQueries({ queryKey: ["debtsTracking"] });
}
```

### Marking Invoice as Debt
```typescript
onSettled: (data, error, variables) => {
  const { id } = variables;
  
  // Specific invoice
  queryClient.invalidateQueries({ queryKey: ["invoice", id] });
  
  // Invoice lists
  queryClient.invalidateQueries({ queryKey: ["invoices"] });
  queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
  
  // Debt queries
  queryClient.invalidateQueries({ queryKey: ["debtsTracking"] });
  queryClient.invalidateQueries({ queryKey: ["emplDebtsTracking"] });
  
  // Related queries
  queryClient.invalidateQueries({ queryKey: ["shiftSummary"] });
  queryClient.invalidateQueries({ queryKey: ["shiftInvoices"] });
  queryClient.invalidateQueries({ queryKey: ["funds"] });
  queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
}
```

### Handling Fund Transfer
```typescript
onSuccess: () => {
  // Fund queries
  queryClient.invalidateQueries({ queryKey: ["funds"] });
  
  // Transfer queries
  queryClient.invalidateQueries({ queryKey: ["pendingTransfers"] });
  queryClient.invalidateQueries({ queryKey: ["checkingPendingTransfers"] });
  queryClient.invalidateQueries({ queryKey: ["transferHistory"] });
  
  // Shift queries
  queryClient.invalidateQueries({ queryKey: ["shiftSummary"] });
  queryClient.invalidateQueries({ queryKey: ["shiftInvoices"] });
  
  // Invoice queries
  queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
}
```

## Best Practices

1. **Always invalidate both specific and general queries**: When updating an entity, invalidate both the specific query (with ID) and the general list query.

2. **Consider UI implications**: Think about where data is displayed in the UI and invalidate accordingly.

3. **Don't over-invalidate**: While it's important to maintain consistency, avoid invalidating unrelated queries.

4. **Use optimistic updates wisely**: For status changes (like marking invoice as paid), use optimistic updates with proper rollback.

5. **Document relationships**: When adding new entities or relationships, update this document to maintain clarity.

## Testing Checklist

When implementing invalidations:

- [ ] Test that the updated entity reflects changes immediately
- [ ] Test that lists containing the entity update
- [ ] Test that related entities show updated information
- [ ] Test that summary views (like shift summaries) update
- [ ] Test that financial totals (funds, balances) update correctly
- [ ] Test optimistic updates and rollbacks work properly

## Future Considerations

1. Consider implementing a central invalidation service to manage complex relationships
2. Add query dependencies to automatically handle cascading invalidations
3. Implement selective invalidation based on the type of change
4. Consider using React Query's query filters for more efficient invalidation patterns
