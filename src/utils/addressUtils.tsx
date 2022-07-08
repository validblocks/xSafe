export function truncateInTheMiddle(address: string, howMany: number): string {
  return `${address.slice(0, howMany)}...${address.slice(
    address.length - howMany,
  )}`;
}
