"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Briefcase,
    Building2,
    Calendar,
    Globe,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  User as UserIcon,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type UserDetails = {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  isVerified: boolean
  createdAt: string 
  profileImage: string | null
  gender: string | null
  company: string | null
  address: string | null
  dateOfBirth: string | null
  preferredLanguage: string | null
  facebook: string | null
  instagram: string | null
  linkedin: string | null
  occupation: string | null
  website: string | null
  bio: string | null
  organization: string | null
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [user, setUser] = React.useState<UserDetails | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

 
  React.useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch user (${res.status})`)
        return res.json()
      })
      .then((json) => setUser(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return <p className="p-6 text-sm text-muted-foreground">Loading user details...</p>
  if (error) return <p className="p-6 text-sm text-red-500">{error}</p>
  if (!user) return <p className="p-6 text-sm text-muted-foreground">User not found.</p>

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-6">
          <div className="relative h-28 w-28 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
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

            {user.bio && (
              <p className="text-sm text-muted-foreground mt-3">{user.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{user.address ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {user.website ? (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.website}
                </a>
              ) : (
                <span>—</span>
              )}
            </div>
          </CardContent>
        </Card>

      
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender</span>
              <span>{user.gender ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date of Birth</span>
              <span>
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preferred Language</span>
              <span>{user.preferredLanguage ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Joined
              </span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

     
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{user.company ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{user.organization ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Occupation</span>
              <span>{user.occupation ?? "—"}</span>
            </div>
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <FaFacebook className="h-4 w-4 text-muted-foreground" />
              {user.facebook ? (
                <a
                  href={user.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.facebook}
                </a>
              ) : (
                <span>—</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaInstagram className="h-4 w-4 text-muted-foreground" />
              {user.instagram ? (
                <a
                  href={user.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.instagram}
                </a>
              ) : (
                <span>—</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaLinkedin className="h-4 w-4 text-muted-foreground" />
              {user.linkedin ? (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.linkedin}
                </a>
              ) : (
                <span>—</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}