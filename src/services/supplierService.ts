/** Adapter boundary for Bharat Dropship. No supplier endpoints or credentials belong in the client. */
export interface SupplierService { searchProducts(query: string): Promise<unknown[]>; syncInventory(productIds: string[]): Promise<void>; createFulfillmentOrder(orderId: string): Promise<unknown> }
export const supplierService: SupplierService | null = null
