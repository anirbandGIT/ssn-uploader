import { useEffect } from "react";

import PersonForm from "../components/PersonForm";
import { apiGet } from "../services";

export default function Home() {
  useEffect(() => {
    apiGet("/health").then(console.log);
  }, []);

  return (
    <div>
      <h2>Upload SSN and details</h2>
      
      <PersonForm />
    </div>
  );
}
