import { useState } from "react";

export default function PersonForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    ssn: "",
  });

  return (
    <form>
      <input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />

      <input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />

      <input
        placeholder="Phone"
        value={form.phoneNumber}
        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
      />

      <input
        placeholder="SSN"
        value={form.ssn}
        onChange={(e) => setForm({ ...form, ssn: e.target.value })}
      />

      <button type="submit">Create</button>
    </form>
  );
}
