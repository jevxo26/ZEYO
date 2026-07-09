"use client"

import * as React from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { EditUserModal } from "@/app/dashboard/users/EditUserModal"

type User = {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  isVerified: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = React.useState(false)

  React.useEffect(() => {
    fetchUsers()
  }, [])

  function fetchUsers() {
    setLoading(true)
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`)
        return res.json()
      })
      .then((json) => setUsers(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  function openEditModal(user: User) {
    setEditingUser(user)
    setIsEditOpen(true)
  }

  function handleUserUpdated(updatedUser: User) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    )
  }

 
  async function handleDelete(user: User) {
    const confirmed = window.confirm(`Are you sure you want to delete "${user.name}"?`)
    if (!confirmed) return

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      })
      const result = await res.json()

      if (res.ok && result.success !== false) {
        toast.success("User deleted successfully")
        setUsers((prev) => prev.filter((u) => u.id !== user.id))
      } else {
        toast.error(result.message || "Failed to delete user")
      }
    } catch (err) {
      toast.error("Something went wrong while deleting")
      console.error(err)
    }
  }

  if (loading) return <p className="p-4 text-sm text-muted-foreground">Loading users...</p>
  if (error) return <p className="p-4 text-sm text-red-500">{error}</p>

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell className="text-center text-muted-foreground" colSpan={8}>
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone ?? "—"}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(user)}
                    aria-label="Edit user"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user)}
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <EditUserModal
        user={editingUser}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdated={handleUserUpdated}
      />
    </div>
  )
}