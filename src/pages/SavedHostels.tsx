import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useHostels } from "@/hooks/useHostels";
import HostelList from "@/components/HostelList";
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
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container px-4 sm:px-6 py-3 flex items-center gap-3">
          
          <Link to="/" className="text-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-base font-semibold">
            ❤️ Saved Hostels
          </h1>

        </div>
      </header>

      {/* Content */}
      <div className="p-4">

        {savedHostels?.length === 0 ? (
          <p>No saved hostels yet</p>
        ) : (
          
        
        
<div>
  <h2 className="text-lg font-bold mb-3">Saved Hostels</h2>

  <HostelList hostels={savedHostels} />
</div>
        

        
        
        )}

      </div>
    </div>
  );
};

export default SavedHostels;