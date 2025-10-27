import { useNavigate } from "react-router-dom";
import { DriverForm } from "@/components/DriverForm";

export default function AddDriver() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // TODO: Implement actual form submission
    navigate("/drivers");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Driver</h1>
        <p className="text-muted-foreground">
          Add a new driver to your organization
        </p>
      </div>

      <DriverForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/drivers")}
      />
    </div>
  );
}
