import Home from "./pages/Home";
import { createPersonSchema } from "@repo/validation";

console.log(createPersonSchema.shape);

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>SSN Uploader</h1>
      <Home />
    </div>
  );
}
