import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// persons
export const persons = pgTable(
  "persons",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),

    phoneNumber: text("phone_number").notNull(),
    ssnEncrypted: text("ssn_encrypted").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  // drizzle is moving away from object return → array return
  (table) => [
    uniqueIndex("phone_unique").on(table.phoneNumber),
    uniqueIndex("ssn_unique").on(table.ssnEncrypted),
  ],
);

// files
export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  personId: uuid("person_id")
    .notNull()
    .references(() => persons.id),

  type: text("type").notNull(), // 'ssn_image' | 'csv'

  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),

  checksum: text("checksum").notNull(),

  path: text("path").notNull(), // minio path

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// audit logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  personId: uuid("person_id"),

  action: text("action").notNull(),

  metadata: text("metadata"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
