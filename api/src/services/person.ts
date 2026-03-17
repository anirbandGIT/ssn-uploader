import { randomUUID } from "crypto";

import { db } from "@repo/db";
import { persons, auditLogs } from "@repo/db/schema.js";
import { encrypt } from "../lib/crypto.js";

export async function createPerson(data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  ssn: string;
}) {
  const encryptedSSN = encrypt(data.ssn);

  const id = randomUUID();

  await db.insert(persons).values({
    id,
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNumber: data.phoneNumber,
    ssnEncrypted: encryptedSSN,
  });

  await db.insert(auditLogs).values({
    personId: id,
    action: "PERSON_CREATED",
    metadata: JSON.stringify({ phone: data.phoneNumber }),
  });

  return { personId: id };
}
