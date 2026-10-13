import type { CustomerAddress } from '../types'
import { createCustomerAddress, deleteCustomerAddress, getCustomerAddresses, setCustomerDefaultAddress, updateCustomerAddress } from './api/customerAddressesApi'
import { createAddress, deleteAddress, getAddressesForCustomer, setDefaultAddress, updateAddress } from './demoAddressService'

export const isCustomerAddressApiEnabled = import.meta.env.PROD || import.meta.env.VITE_CUSTOMER_ADDRESS_API === 'true'
export function loadAddresses(customerId: string): Promise<CustomerAddress[]> { return isCustomerAddressApiEnabled ? getCustomerAddresses(customerId) : Promise.resolve(getAddressesForCustomer(customerId)) }
export function saveAddress(input: Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerAddress | null> { return isCustomerAddressApiEnabled ? createCustomerAddress(input, input.customerId) : Promise.resolve(createAddress(input)) }
export function editAddress(id: string, customerId: string, input: Omit<CustomerAddress, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>): Promise<CustomerAddress | null> { return isCustomerAddressApiEnabled ? updateCustomerAddress(id, input, customerId) : Promise.resolve(updateAddress(id, customerId, input)) }
export function removeAddress(id: string, customerId: string): Promise<boolean> { return isCustomerAddressApiEnabled ? deleteCustomerAddress(id).then(() => true) : Promise.resolve(deleteAddress(id, customerId)) }
export function makeDefaultAddress(id: string, customerId: string): Promise<CustomerAddress | boolean> { return isCustomerAddressApiEnabled ? setCustomerDefaultAddress(id, customerId) : Promise.resolve(setDefaultAddress(id, customerId)) }
