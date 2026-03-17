import { useEffect } from "react";

import PersonForm from "../components/PersonForm";
import { apiFetch } from "../services/api";

export default function Home() {
  useEffect(() => {
    apiFetch("/health").then(console.log);
  }, []);

  return (
    <div>
      <h2>Upload and edit SSN and details</h2>
      
      <PersonForm />
    </div>
  );
}
