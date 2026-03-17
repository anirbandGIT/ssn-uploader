import { useState } from "react";

import { apiFetch } from "../services/api";

export default function PersonForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    ssn: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiFetch("/persons", {
        method: "POST",
        body: JSON.stringify(form),
      });
      console.log("Created:", res);
    } catch (err: unknown) {
      console.log(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">SUBMIT</button>
    </form>
  );
}
