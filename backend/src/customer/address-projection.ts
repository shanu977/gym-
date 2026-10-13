import type { Prisma, AddressType } from "@prisma/client";

export const customerAddressSelect = {
  id: true,
  fullName: true,
  mobile: true,
  addressLine1: true,
  addressLine2: true,
  landmark: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  addressType: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ShippingAddressSelect;

export type CustomerAddressRecord = Prisma.ShippingAddressGetPayload<{ select: typeof customerAddressSelect }>;

const addressTypeLabels: Record<AddressType, "Home" | "Work" | "Other"> = {
  HOME: "Home",
  WORK: "Work",
  OTHER: "Other",
};

export function toCustomerAddressResponse(address: CustomerAddressRecord) {
  return {
    id: address.id,
    fullName: address.fullName,
    mobile: address.mobile,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? "",
    landmark: address.landmark ?? "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    addressType: addressTypeLabels[address.addressType],
    isDefault: address.isDefault,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  };
}

export function toAddressType(value: "Home" | "Work" | "Other"): AddressType {
  return value === "Home" ? "HOME" : value === "Work" ? "WORK" : "OTHER";
}
