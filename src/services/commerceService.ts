/** UI-safe boundary for future store, payment and fulfillment integrations. */
export interface CommerceService { searchProducts(query: string): Promise<unknown[]>; createOrder(input: unknown): Promise<unknown> }
export const commerceService: CommerceService | null = null
