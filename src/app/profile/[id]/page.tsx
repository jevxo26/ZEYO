"use client";

import * as React from "react";
import Image from "next/image";
import {
  Briefcase, Building2, Calendar, Globe, Mail, Phone, MapPin,
  User as UserIcon, Pencil, Check, X,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditableField } from "@/components/EditableField";

type UserProfile = {
  id: number;
  name: string;
  fullName?: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  isVerified?: boolean;
  createdAt: string;
  profileImage: string | null;
  gender: string | null;
  address: string | null; // still not editable — no DB field yet
  dateOfBirth: string | null;
  company: string | null; // maps to companyName in DB
  organization: string | null;
  occupation: string | null;
  website: string | null;
  bio: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  preferredLanguage: string | null;
};

// Now includes User-table fields too (firstName, lastName, phone, gender, dateOfBirth)
const EDITABLE_FIELDS: (keyof UserProfile)[] = [
  "firstName",
  "lastName",
  "phone",
  "gender",
  "dateOfBirth",
  "preferredLanguage",
  "website",
  "company",
  "organization",
  "occupation",
  "facebook",
  "instagram",
  "linkedin",
  "bio",
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const SOCIAL_FIELDS = [
  { icon: FaFacebook, field: "facebook" as const, placeholder: "Facebook URL" },
  { icon: FaInstagram, field: "instagram" as const, placeholder: "Instagram URL" },
  { icon: FaLinkedin, field: "linkedin" as const, placeholder: "LinkedIn URL" },
];

export default function ProfilePage() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<UserProfile>>({});
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const fetchProfile = React.useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      setError("You're not logged in.");
      return;
    }
    try {
      const res = await fetch("/api/users/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) setUser(result.data);
      else setError(result.message || "Failed to load profile.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditStart = () => {
    if (!user) return;
    const initial: Partial<UserProfile> = {};
    EDITABLE_FIELDS.forEach((field) => {
      initial[field] = user[field] as never;
    });
    // Normalize date for the <input type="date"> field
    if (initial.dateOfBirth) {
      initial.dateOfBirth = (initial.dateOfBirth as string).slice(0, 10);
    }
    setFormData(initial);
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setSaveError(null);
  };

  const set = (field: keyof UserProfile) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const f = (field: keyof UserProfile) => (formData[field] as string) ?? "";

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setSaveError("You're not logged in.");
      return;
    }
    setSaving(true);
    setSaveError(null);

    // Map frontend "company" -> backend "companyName"
    const payload: Record<string, unknown> = { ...formData };
    if ("company" in payload) {
      payload.companyName = payload.company;
      delete payload.company;
    }

    try {
      const res = await fetch("/api/users/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, ...formData } : prev));
        setIsEditing(false);
        setFormData({});
      } else {
        setSaveError(result.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setSaveError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Loading profile...</p>;
  if (error) return <p className="p-6 text-sm text-red-500">{error}</p>;
  if (!user) return <p className="p-6 text-sm text-muted-foreground">User not found.</p>;

  const displayName = user.fullName || user.name;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card accent="blue">
        <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-6">
          <div className="relative h-28 w-28 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
            {user.profileImage ? (
              <Image src={user.profileImage} alt={displayName} fill className="object-cover" />
            ) : (
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-between gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEditStart}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <p className="text-muted-foreground">{user.occupation ?? "—"}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === "active"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {user.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-foreground">
                {user.role}
              </span>
              {user.isVerified && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-foreground">
                  Verified
                </span>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={f("bio")}
                onChange={(e) => set("bio")(e.target.value)}
                className="w-full mt-3 text-sm border rounded-md p-2 resize-none"
                rows={2}
                placeholder="Bio"
              />
            ) : (
              user.bio && <p className="text-sm text-muted-foreground mt-3">{user.bio}</p>
            )}

            {saveError && <p className="text-sm text-red-500 mt-2">{saveError}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information — address stays read-only */}
        <Card accent="blue">
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <EditableField icon={Mail} value={user.email} isEditing={false} onChange={() => {}} />
            <EditableField
              icon={Phone}
              value={f("phone")}
              isEditing={isEditing}
              onChange={set("phone")}
              placeholder="Phone number"
              displayValue={user.phone ?? "—"}
            />
            <EditableField icon={MapPin} value={user.address ?? "—"} isEditing={false} onChange={() => {}} />
            <EditableField
              icon={Globe}
              value={f("website")}
              isEditing={isEditing}
              onChange={set("website")}
              placeholder="Website URL"
              displayValue={
                user.website ? (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {user.website}
                  </a>
                ) : undefined
              }
            />
          </CardContent>
        </Card>

        {/* Personal Information — all editable now */}
        <Card accent="purple">
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <EditableField
              layout="between"
              label="First Name"
              value={f("firstName")}
              isEditing={isEditing}
              onChange={set("firstName")}
              displayValue={user.firstName || "-"}
            />
            <EditableField
              layout="between"
              label="Last Name"
              value={f("lastName")}
              isEditing={isEditing}
              onChange={set("lastName")}
              displayValue={user.lastName || "-"}
            />
            <EditableField
              layout="between"
              label="Gender"
              value={f("gender")}
              isEditing={isEditing}
              onChange={set("gender")}
              options={GENDER_OPTIONS}
              displayValue={user.gender ?? "—"}
            />
            <EditableField
              layout="between"
              label="Date of Birth"
              type="date"
              value={f("dateOfBirth")}
              isEditing={isEditing}
              onChange={set("dateOfBirth")}
              displayValue={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"}
            />
            <EditableField
              layout="between"
              label="Preferred Language"
              value={f("preferredLanguage")}
              isEditing={isEditing}
              onChange={set("preferredLanguage")}
              displayValue={user.preferredLanguage ?? "—"}
            />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Joined
              </span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Work Information — all editable */}
        <Card accent="green">
          <CardHeader>
            <CardTitle className="text-base">Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <EditableField icon={Building2} value={f("company")} isEditing={isEditing} onChange={set("company")} placeholder="Company" displayValue={user.company ?? "—"} />
            <EditableField icon={Briefcase} value={f("organization")} isEditing={isEditing} onChange={set("organization")} placeholder="Organization" displayValue={user.organization ?? "—"} />
            <EditableField layout="between" label="Occupation" value={f("occupation")} isEditing={isEditing} onChange={set("occupation")} displayValue={user.occupation ?? "—"} />
          </CardContent>
        </Card>

        {/* Social Links — all editable */}
        <Card accent="rose">
          <CardHeader>
            <CardTitle className="text-base">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {SOCIAL_FIELDS.map(({ icon, field, placeholder }) => (
              <EditableField
                key={field}
                icon={icon}
                value={f(field)}
                isEditing={isEditing}
                onChange={set(field)}
                placeholder={placeholder}
                displayValue={
                  user[field] ? (
                    <a href={user[field]!} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {user[field]}
                    </a>
                  ) : undefined
                }
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}