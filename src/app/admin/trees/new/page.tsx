'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save } from 'lucide-react'
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

export default function NewTreePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    color: '#6366f1',
    icon: 'BookOpen',
    rolePath: '',
    isActive: true,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    })
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
    
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rolePath: formData.rolePath || null,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create tree')
      }
      
      toast.success('Quest tree created successfully!')
      router.push('/admin/trees')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Create New Quest Tree">
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
                onChange={(e) => handleNameChange(e.target.value)}
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
                URL-friendly identifier (auto-generated from name)
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
              <p className="text-xs text-muted-foreground mt-1">
                Optionally associate this tree with a specific role path
              </p>
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

            {/* Preview */}
            <div>
              <label className="text-sm font-medium mb-2 block">Preview</label>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name.charAt(0) || 'T'}
                  </div>
                  <div>
                    <h3 className="font-semibold">{formData.name || 'Tree Name'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || 'Description will appear here'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/trees">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Tree
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}
