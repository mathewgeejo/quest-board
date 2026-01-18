'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface QuestTree {
  id: string
  name: string
  description: string
  slug: string
  color: string
  icon: string
  rolePath: string | null
  isActive: boolean
  _count: {
    quests: number
  }
  createdAt: string
}

export default function AdminTreesPage() {
  const [trees, setTrees] = useState<QuestTree[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTrees()
  }, [])

  const fetchTrees = async () => {
    try {
      const res = await fetch('/api/admin/trees')
      if (res.ok) {
        const data = await res.json()
        setTrees(data)
      }
    } catch (error) {
      console.error('Failed to fetch trees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (treeId: string) => {
    if (!confirm('Are you sure you want to delete this tree? All associated quests will be unlinked.')) return

    try {
      const res = await fetch(`/api/admin/trees/${treeId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Tree deleted')
        setTrees(trees.filter((t) => t.id !== treeId))
      } else {
        toast.error('Failed to delete tree')
      }
    } catch (error) {
      toast.error('Failed to delete tree')
    }
  }

  const filteredTrees = trees.filter((tree) =>
    tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tree.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout title="Quest Trees">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Quest Tree Management"
      subtitle={`${trees.length} trees total`}
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 sm:w-64 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Link href="/admin/trees/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tree
            </Button>
          </Link>
        </div>

        {/* Trees Grid */}
        {filteredTrees.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrees.map((tree) => (
              <Card key={tree.id} className="overflow-hidden">
                <div
                  className="h-2"
                  style={{ backgroundColor: tree.color || '#6366f1' }}
                />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: (tree.color || '#6366f1') + '20' }}
                      >
                        <BookOpen className="h-5 w-5" style={{ color: tree.color || '#6366f1' }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tree.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {tree._count.quests} quests
                        </p>
                      </div>
                    </div>
                    {!tree.isActive && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/10 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tree.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/trees/${tree.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(tree.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No quest trees found</p>
              <Link href="/admin/trees/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first tree
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
