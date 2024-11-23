import React, { useState, useEffect } from "react";

function App() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(
    Notification.permission === "granted"
  );

  // Request Notification Permission
  const requestNotificationPermission = () => {
    if (
      Notification.permission === "default" ||
      Notification.permission === "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setIsPermissionGranted(true);
          alert("Notification permission granted!");
        } else {
          alert("Notification permission denied.");
        }
      });
    } else {
      alert("Notification permission has already been granted.");
    }
  };

  // Function to Clock In
  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    // Set clock-out time to 10 minutes from now for demo purposes
    const targetClockOutTime = new Date(now.getTime() + 1 * 60 * 1000);
    setClockOutTime(targetClockOutTime);
    setIsClockedIn(true);
    alert("Clocked in at: " + now.toLocaleTimeString());
  };

  // Function to Clock Out
  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockInTime(null);
    setClockOutTime(null);
    alert("Clocked out successfully!");
  };

  // Function to send notification if user hasn't clocked out on time
  const sendClockOutReminderNotification = () => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Reminder to Clock Out", {
        body: "It’s time to clock out! Please remember to clock out.",
        icon: "https://via.placeholder.com/150",
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else {
      alert("Please enable notifications first.");
    }
  };

  // Effect to check if it's time to remind user to clock out
  useEffect(() => {
    if (isClockedIn && clockOutTime) {
      const checkClockOutTime = setInterval(() => {
        const now = new Date();
        if (now >= clockOutTime) {
          sendClockOutReminderNotification();
          clearInterval(checkClockOutTime); // Stop checking after the reminder
        }
      }, 1000); // Check every second

      return () => clearInterval(checkClockOutTime); // Cleanup interval on unmount
    }
  }, [isClockedIn, clockOutTime]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Clock In / Clock Out Demo</h1>
      <p>
        Click "Enable Notifications" to allow notifications, then "Clock In" to
        start.
      </p>
      <button
        onClick={requestNotificationPermission}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Enable Notifications
      </button>
      <button
        onClick={handleClockIn}
        style={{ margin: "10px", padding: "10px 20px" }}
        disabled={!isPermissionGranted || isClockedIn}
      >
        Clock In
      </button>
      <button
        onClick={handleClockOut}
        style={{ margin: "10px", padding: "10px 20px" }}
        disabled={!isClockedIn}
      >
        Clock Out
      </button>
      {isClockedIn && clockOutTime && (
        <p>Scheduled Clock-Out Time: {clockOutTime.toLocaleTimeString()}</p>
      )}
    </div>
  );
}

export default App;
