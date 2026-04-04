import { Link } from "react-router-dom";
import { useHostels } from "@/hooks/useHostels";

const SavedHostels = () => {
  const savedIds = JSON.parse(localStorage.getItem("savedHostels") || "[]");

  const { data: hostels, isLoading } = useHostels();

  const savedHostels = hostels?.filter((hostel) =>
    savedIds.includes(hostel.id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-xl font-bold mb-4">❤️ Saved Hostels</h1>

      {savedHostels?.length === 0 ? (
        <p>No saved hostels yet</p>
      ) : (
        <div className="grid gap-4">
          {savedHostels.map((hostel) => (
            <Link
              key={hostel.id}
              to={`/hostel/${hostel.id}`}
              className="block border rounded-lg p-3"
            >
              <img
                src={hostel.images?.[0]}
                alt={hostel.name}
                className="w-full h-40 object-cover rounded-md"
              />

              <h2 className="font-bold mt-2">{hostel.name}</h2>
              <p className="text-sm text-primary">{hostel.price}</p>
              <p className="text-xs text-muted-foreground">
                {hostel.location}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedHostels;