import { Button } from "@/components/ui/button";
import { Bell, TestTube } from "lucide-react";

export default function NotificationTest() {
  const handleTestNotification = async () => {
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1
        }),
      });

      if (response.ok) {
        console.log("Test notification sent!");
      } else {
        console.error("Failed to send test notification");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <Button
      onClick={handleTestNotification}
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-50 bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
    >
      <TestTube className="h-4 w-4 mr-2" />
      Test Notification
    </Button>
  );
}