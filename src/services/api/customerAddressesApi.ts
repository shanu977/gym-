import type { CustomerAddress } from '../../types'
import { apiRequest } from './client'

type AddressPayload = Omit<CustomerAddress, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>
type AddressResponse = Omit<CustomerAddress, 'customerId'>
function mapAddress(address: AddressResponse, customerId: string): CustomerAddress { return { ...address, customerId } }
export async function getCustomerAddresses(customerId: string) { const response = await apiRequest<{ addresses: AddressResponse[] }>('/customer/addresses'); return response.addresses.map((address) => mapAddress(address, customerId)) }
export async function getCustomerAddress(id: string, customerId: string) { const response = await apiRequest<{ address: AddressResponse }>(`/customer/addresses/${encodeURIComponent(id)}`); return mapAddress(response.address, customerId) }
export async function createCustomerAddress(input: AddressPayload, customerId: string) { const response = await apiRequest<{ address: AddressResponse }>('/customer/addresses', { method: 'POST', body: JSON.stringify(input) }); return mapAddress(response.address, customerId) }
export async function updateCustomerAddress(id: string, input: AddressPayload, customerId: string) { const response = await apiRequest<{ address: AddressResponse }>(`/customer/addresses/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(input) }); return mapAddress(response.address, customerId) }
export async function deleteCustomerAddress(id: string) { await apiRequest<undefined>(`/customer/addresses/${encodeURIComponent(id)}`, { method: 'DELETE' }) }
export async function setCustomerDefaultAddress(id: string, customerId: string) { const response = await apiRequest<{ address: AddressResponse }>(`/customer/addresses/${encodeURIComponent(id)}/default`, { method: 'PATCH', body: JSON.stringify({}) }); return mapAddress(response.address, customerId) }
