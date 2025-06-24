import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Mail, 
  Camera,
  Upload,
  Edit
} from "lucide-react";
import { type Client } from "@shared/schema";

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export default function EditClientModal({ open, onOpenChange, client }: EditClientModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    notes: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client && open) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        avatar: client.avatar || "",
        notes: client.notes || "",
      });
    }
  }, [client, open]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFormData(prev => ({ ...prev, avatar: dataUrl }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to process image:", error);
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in both name and email fields");
      return;
    }

    if (!client?.id) {
      alert("No client selected for editing");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
        alert("Client updated successfully!");
      } else {
        const errorData = await response.text();
        console.error("Server error:", errorData);
        alert(`Failed to update client: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred while updating client");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Client
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Update client information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Picture */}
          <div>
            <Label className="text-white flex items-center gap-2 mb-3">
              <Camera className="h-4 w-4" />
              Profile Picture
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {formData.avatar ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
                    <img 
                      src={formData.avatar} 
                      alt="Client avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-semibold">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </Button>
                {formData.avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-slate-400 hover:text-white"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <Label htmlFor="edit-name" className="text-white flex items-center gap-2">
              <User className="h-4 w-4" />
              Name *
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Client name"
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>

          <div>
            <Label htmlFor="edit-email" className="text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email *
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="client@example.com"
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>

          <div>
            <Label htmlFor="edit-notes" className="text-white">
              Additional Notes
            </Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information about this client"
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t border-white/20">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="text-slate-400 hover:text-white"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isSubmitting ? "Updating..." : "Update Client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}