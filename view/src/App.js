import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./mediaquery.css";

// Use relative path for API calls (works with Vercel routing)
// In development, use localhost; in production, use relative path
export const backend_url = 
  process.env.NODE_ENV === "development" 
    ? "http://localhost:8000" 
    : "";

function App() {
  return (
    <div as="body" className="App">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;
