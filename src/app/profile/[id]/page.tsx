"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          setUser(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center">

            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border"
            />

            <h2 className="text-2xl font-bold mt-4">
              {user.fullName || user.name}
            </h2>

            <p className="text-gray-500">{user.email}</p>

            <div className="grid grid-cols-2 gap-6 w-full mt-8">

              <div>
                <p className="font-semibold">First Name</p>
                <p>{user.firstName || "-"}</p>
              </div>

              <div>
                <p className="font-semibold">Last Name</p>
                <p>{user.lastName || "-"}</p>
              </div>

              <div>
                <p className="font-semibold">Phone</p>
                <p>{user.phone || "-"}</p>
              </div>

              <div>
                <p className="font-semibold">Gender</p>
                <p>{user.gender || "-"}</p>
              </div>

              <div>
                <p className="font-semibold">Role</p>
                <p>{user.role || "-"}</p>
              </div>

              <div>
                <p className="font-semibold">Status</p>
                <p>{user.status}</p>
              </div>

              <div>
                <p className="font-semibold">Date of Birth</p>
                <p>
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "-"}
                </p>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}