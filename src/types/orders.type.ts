export interface OrdersCategoriesCreateDto {
    name: string;
    description: string;
}
export interface OrdersCategoriesCreateResponseDto {
    id: number;
    name: string;
    description: string;
}


export interface OrdersCategoriesFetchDto {
    id: number,
    name: string,
    description: string,
    _count: {
        orders: number
    },
    customersCount: number,
    customers: []
}



export interface OrdersFetchDto {
    customerId: number,
    totalAmount: number,
    paidStatus: boolean,
    notes: string,
    categoryId: number,
    items: {
        itemId: number,
        quantity: number,
        unitPrice: number,
        unit: string,
        notes: string,
    }[],
    isForToday: boolean
}


export interface OrdersFetchResponseDto {
    order: {
        "id": 1,
        "orderNumber": "ORD-1744988126767",
        "customerId": 1,
        "totalAmount": 15000,
        "paidStatus": true,
        "status": "pending",
        "createdAt": "2025-04-18T14:55:26.777Z",
        "scheduledFor": "2025-04-19T10:00:00.000Z",
        "deliveryDate": null,
        "notes": "طلبية كعك ",
        "categoryId": 1,
        "invoiceId": null,
        "employeeId": 1,
        "customer": {
            "id": 1,
            "name": "شركة الأمل للتجارة",
            "phone": "0912315678",
            "notes": "عميل جديد من منطقة الرياض",
            "createdAt": "2025-04-17T09:42:54.859Z",
            "updatedAt": "2025-04-17T09:42:54.859Z",
            "categoryId": 1
        },
        "category": {
            "id": 1,
            "name": "طلبيات منزلية",
            "description": "طلبيات للزبائن المنزليين",
            "createdAt": "2025-04-17T09:42:02.471Z",
            "updatedAt": "2025-04-17T09:42:02.471Z"
        },
        "employee": {
            "username": "admin"
        },
        "items": [
            {
                "id": 1,
                "orderId": 1,
                "itemId": 2,
                "quantity": 10,
                "unitPrice": 1500,
                "unit": "قطعة",
                "subTotal": 15000,
                "notes": "كعك بالسمسم",
                "item": {
                    "id": 2,
                    "name": "معروك شوكولا",
                    "type": "production",
                    "units": [
                        {
                            "unit": "قطعة",
                            "price": 3200,
                            "factor": 1
                        },
                        {
                            "unit": "صاج",
                            "price": 64000,
                            "factor": 20
                        }
                    ],
                    "defaultUnit": "قطعة",
                    "cost": 0,
                    "price": 3200,
                    "description": "",
                    "groupId": 1
                }
            }
        ]
    },
    invoice: {
        id: number,
        invoiceNumber: string,
        invoiceType: string,
        invoiceCategory: string,
        customerId: number,
        totalAmount: number,
        discount: number,
        additionalAmount: number,
        paidStatus: boolean,
        paymentDate: string,
        createdAt: string,
        notes: string,
        isBreak: false,
        fundId: number,
        shiftId: number,
        employeeId: number,
        relatedDebtId: null,
        trayCount: number,
        relatedAdvanceId: null,
        items: {
            id: number,
            quantity: number,
            unitPrice: number,
            subTotal: number,
            unit: string,
            invoiceId: number,
            itemId: number,
            item: {
                id: number,
                name: string,
                type: string,
                units: {
                    unit: "قطعة",
                    price: 3200,
                    factor: 1
                }[],
                "defaultUnit": "قطعة",
                "cost": 0,
                "price": 3200,
                "description": "",
                "groupId": 1
            }
        }[],
        "customer": {
            "id": 1,
            "name": "شركة الأمل للتجارة",
            "phone": "0912315678",
            "notes": "عميل جديد من منطقة الرياض",
            "createdAt": "2025-04-17T09:42:54.859Z",
            "updatedAt": "2025-04-17T09:42:54.859Z",
            "categoryId": 1
        }
    },
    message: string
}