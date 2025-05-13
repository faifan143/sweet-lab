// Central query keys management for the entire application
export const QUERY_KEYS = {
  // Workshops
  workshops: {
    all: ['workshops'] as const,
    list: () => ['workshops', 'list'] as const,
    detail: (id: number) => ['workshops', 'detail', id] as const,
    summary: (id: number, params: any) => ['workshops', 'summary', id, params] as const,
    production: (id: number) => ['workshops', 'production', id] as const,
    hours: (id: number) => ['workshops', 'hours', id] as const,
    employees: (id: number) => ['workshops', 'employees', id] as const,
  },
  
  // Employees
  employees: {
    all: ['employees'] as const,
    list: () => ['employees', 'list'] as const,
    detail: (id: number) => ['employees', 'detail', id] as const,
    debts: (id?: number) => id ? ['employees', 'debts', id] as const : ['employees', 'debts'] as const,
    financialSummary: (id: number) => ['employees', 'financial-summary', id] as const,
  },
  
  // Debts
  debts: {
    all: ['debts'] as const,
    employee: (employeeId: number) => ['debts', 'employee', employeeId] as const,
    customer: (customerId: number) => ['debts', 'customer', customerId] as const,
  },
  
  // Invoices
  invoices: {
    all: ['invoices'] as const,
    list: () => ['invoices', 'list'] as const,
    detail: (id: number) => ['invoices', 'detail', id] as const,
    employee: (employeeId: number) => ['invoices', 'employee', employeeId] as const,
    stats: () => ['invoices', 'stats'] as const,
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    list: () => ['orders', 'list'] as const,
    detail: (id: number) => ['orders', 'detail', id] as const,
    customer: (customerId: number) => ['orders', 'customer', customerId] as const,
  },
  
  // Items
  items: {
    all: ['items'] as const,
    list: () => ['items', 'list'] as const,
    detail: (id: number) => ['items', 'detail', id] as const,
    groups: () => ['items', 'groups'] as const,
  },
  
  // Customers
  customers: {
    all: ['customers'] as const,
    list: () => ['customers', 'list'] as const,
    detail: (id: number) => ['customers', 'detail', id] as const,
    categories: () => ['customers', 'categories'] as const,
  },
  
  // Funds
  funds: {
    all: ['funds'] as const,
    list: () => ['funds', 'list'] as const,
    detail: (id: number) => ['funds', 'detail', id] as const,
  },
  
  // Shifts
  shifts: {
    all: ['shifts'] as const,
    list: () => ['shifts', 'list'] as const,
    detail: (id: number) => ['shifts', 'detail', id] as const,
    current: () => ['shifts', 'current'] as const,
  },
  
  // Advances
  advances: {
    all: ['advances'] as const,
    list: () => ['advances', 'list'] as const,
    detail: (id: number) => ['advances', 'detail', id] as const,
  },
  
  // Warehouse
  warehouse: {
    all: ['warehouse'] as const,
    materials: () => ['warehouse', 'materials'] as const,
    invoices: () => ['warehouse', 'invoices'] as const,
    stats: () => ['warehouse', 'stats'] as const,
  },
  
  // Trays
  trays: {
    all: ['trays'] as const,
    list: () => ['trays', 'list'] as const,
    detail: (id: number) => ['trays', 'detail', id] as const,
  },
  
  // Users and Roles
  users: {
    all: ['users'] as const,
    list: () => ['users', 'list'] as const,
    detail: (id: number) => ['users', 'detail', id] as const,
    roles: () => ['users', 'roles'] as const,
  },
} as const;
