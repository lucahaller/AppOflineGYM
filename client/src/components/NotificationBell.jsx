import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

export default function NotificationBell() {
  const [showPanel, setShowPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener notificaciones", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:3000/users/notifications/${id}/read`, {
        method: "PATCH",
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error al marcar como leída", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel((prev) => !prev)}
        className="relative text-xl"
      >
        <FaBell className="text-gray-700 hover:text-black" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
            {notifications.length}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 z-50 bg-white border rounded shadow-lg w-80 max-h-96 overflow-y-auto p-4">
          <h2 className="text-base font-semibold mb-2">Notificaciones</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay notificaciones nuevas
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex justify-between items-start border-b py-2"
              >
                <div className="flex-1">
                  <p className="text-sm">
                    🔔{" "}
                    {n.user?.name ? (
                      <a
                        href={`/dashboard/users/${n.user.id}`}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {n.message}
                      </a>
                    ) : (
                      n.message
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(n.date).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✖
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
