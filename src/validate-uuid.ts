export function validateUUID(uuid: string) {
  const UUIDRegex =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  return UUIDRegex.test(uuid);
}
