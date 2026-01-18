'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Save, BookOpen, Swords } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const ROLE_PATHS = [
  { value: '', label: 'All Roles' },
  { value: 'FRONTEND', label: 'Frontend Developer' },
  { value: 'BACKEND', label: 'Backend Developer' },
  { value: 'DEVOPS', label: 'DevOps Engineer' },
  { value: 'FULLSTACK', label: 'Full-Stack Developer' },
  { value: 'SECURITY', label: 'Security Engineer' },
  { value: 'PRODUCT', label: 'Product Manager' },
]

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6',
  '#EF4444', '#EC4899', '#06B6D4', '#84CC16',
]

const ICONS = [
  'BookOpen', 'Code', 'Database', 'Globe', 'Lock',
  'Server', 'Terminal', 'Zap', 'Layers', 'Cpu',
]

interface TreeQuest {
  id: string
  name: string
  difficulty: string
  layer: string
  order: number
}

export default function EditTreePage() {
  const router = useRouter()
  const params = useParams()
  const treeId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [quests, setQuests] = useState<TreeQuest[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    color: '#6366f1',
    icon: 'BookOpen',
    rolePath: '',
    isActive: true,
  })

  useEffect(() => {
    fetchTree()
  }, [treeId])

  const fetchTree = async () => {
    try {
      const res = await fetch(`/api/admin/trees/${treeId}`)
      if (res.ok) {
        const tree = await res.json()
        setFormData({
          name: tree.name || '',
          description: tree.description || '',
          slug: tree.slug || '',
          color: tree.color || '#6366f1',
          icon: tree.icon || 'BookOpen',
          rolePath: tree.rolePath || '',
          isActive: tree.isActive ?? true,
        })
        setQuests(tree.quests || [])
      } else {
        toast.error('Tree not found')
        router.push('/admin/trees')
      }
    } catch (error) {
      console.error('Failed to fetch tree:', error)
      toast.error('Failed to load tree')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Tree name is required')
      return
    }
    
    if (!formData.slug.trim()) {
      toast.error('Slug is required')
      return
    }
    
    setSaving(true)
    
    try {
      const res = await fetch(`/api/admin/trees/${treeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rolePath: formData.rolePath || null,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update tree')
      }
      
      toast.success('Quest tree updated successfully!')
      router.push('/admin/trees')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      NOVICE: 'bg-green-500/10 text-green-500',
      APPRENTICE: 'bg-blue-500/10 text-blue-500',
      JOURNEYMAN: 'bg-yellow-500/10 text-yellow-500',
      EXPERT: 'bg-orange-500/10 text-orange-500',
      MASTER: 'bg-red-500/10 text-red-500',
    }
    return colors[difficulty] || 'bg-gray-500/10 text-gray-500'
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Quest Tree">
        <div className="space-y-6 max-w-2xl">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Quest Tree">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/trees">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trees
            </Button>
          </Link>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tree Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., React Fundamentals"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="react-fundamentals"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL-friendly identifier
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what learners will achieve..."
                className="w-full px-3 py-2 border rounded-md text-sm bg-background min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Role Path (optional)</label>
              <select
                value={formData.rolePath}
                onChange={(e) => setFormData({ ...formData, rolePath: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
              >
                {ROLE_PATHS.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm">Tree is active and visible</label>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-8 w-8 rounded-lg transition-transform ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Quests in this Tree */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5" />
              Quests in this Tree ({quests.length})
            </CardTitle>
            <Link href={`/admin/quests/new?treeId=${treeId}`}>
              <Button type="button" variant="outline" size="sm">
                Add Quest
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {quests.length > 0 ? (
              <div className="space-y-2">
                {quests.map((quest) => (
                  <Link
                    key={quest.id}
                    href={`/admin/quests/${quest.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-8">
                        #{quest.order}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{quest.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {quest.layer.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(quest.difficulty)}`}>
                      {quest.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No quests in this tree yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/trees">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}
