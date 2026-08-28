type AdminIdentity = {
  email: string;
  role: string;
};

export function hasAdminAccess(identity: AdminIdentity, allowlistValue: string): boolean {
  const allowlist = allowlistValue
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return (
    identity.role === "admin" &&
    allowlist.length > 0 &&
    allowlist.includes(identity.email.trim().toLowerCase())
  );
}
