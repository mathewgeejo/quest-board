'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface QuestTree {
  id: string
  name: string
}

interface QuestTask {
  id?: string
  title: string
  description: string
  order: number
}

export default function EditQuestPage() {
  const router = useRouter()
  const params = useParams()
  const questId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [trees, setTrees] = useState<QuestTree[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'NOVICE',
    xpReward: 50,
    estimatedTime: 30,
    deadline: '',
    treeId: '',
    layer: 'FOUNDATIONS',
    order: 1,
    prerequisites: [] as string[],
    isActive: true,
  })
  const [tasks, setTasks] = useState<QuestTask[]>([])
  const [resources, setResources] = useState<string[]>([''])
  const [hints, setHints] = useState<string[]>([''])

  useEffect(() => {
    fetchTrees()
    fetchQuest()
  }, [questId])

  const fetchTrees = async () => {
    try {
      const res = await fetch('/api/admin/trees')
      if (res.ok) {
        const data = await res.json()
        setTrees(data)
      }
    } catch (error) {
      console.error('Failed to fetch trees:', error)
    }
  }

  const fetchQuest = async () => {
    try {
      const res = await fetch(`/api/admin/quests/${questId}`)
      if (res.ok) {
        const quest = await res.json()
        setFormData({
          name: quest.name || '',
          description: quest.description || '',
          difficulty: quest.difficulty || 'NOVICE',
          xpReward: quest.xpReward || 50,
          estimatedTime: quest.estimatedTime || 30,
          deadline: quest.deadline ? quest.deadline.split('T')[0] : '',
          treeId: quest.treeId || '',
          layer: quest.layer || 'FOUNDATIONS',
          order: quest.order || 1,
          prerequisites: quest.prerequisites || [],
          isActive: quest.isActive ?? true,
        })
        setTasks(quest.tasks?.length ? quest.tasks : [{ title: '', description: '', order: 1 }])
        setResources(quest.resources?.length ? quest.resources : [''])
        setHints(quest.hints?.length ? quest.hints : [''])
      } else {
        toast.error('Quest not found')
        router.push('/admin/quests')
      }
    } catch (error) {
      console.error('Failed to fetch quest:', error)
      toast.error('Failed to load quest')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Quest name is required')
      return
    }
    
    setSaving(true)
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        xpReward: Number(formData.xpReward),
        estimatedHours: Number(formData.estimatedTime),
        treeId: formData.treeId,
        tasks: tasks.filter((t) => t.title.trim()),
        resources: resources.filter((r) => r.trim()),
      }
      
      const res = await fetch(`/api/admin/quests/${questId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update quest')
      }
      
      toast.success('Quest updated successfully!')
      router.push('/admin/quests')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const addTask = () => {
    setTasks([...tasks, { title: '', description: '', order: tasks.length + 1 }])
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateTask = (index: number, field: string, value: string) => {
    const updated = [...tasks]
    updated[index] = { ...updated[index], [field]: value }
    setTasks(updated)
  }

  const addResource = () => setResources([...resources, ''])
  const removeResource = (index: number) => setResources(resources.filter((_, i) => i !== index))
  const updateResource = (index: number, value: string) => {
    const updated = [...resources]
    updated[index] = value
    setResources(updated)
  }

  const addHint = () => setHints([...hints, ''])
  const removeHint = (index: number) => setHints(hints.filter((_, i) => i !== index))
  const updateHint = (index: number, value: string) => {
    const updated = [...hints]
    updated[index] = value
    setHints(updated)
  }

  const difficulties = ['NOVICE', 'APPRENTICE', 'JOURNEYMAN', 'EXPERT', 'MASTER']
  const layers = ['FOUNDATIONS', 'TOOL_MASTERY', 'SPECIALIZATION', 'CAPSTONE']

  if (loading) {
    return (
      <AdminLayout title="Edit Quest">
        <div className="space-y-6 max-w-4xl">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Quest">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/quests">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quests
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
              <label className="text-sm font-medium mb-1 block">Quest Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter quest name"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the quest..."
                className="w-full px-3 py-2 border rounded-md text-sm bg-background min-h-[100px]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">XP Reward</label>
                <Input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Estimated Time (minutes)</label>
                <Input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Deadline (optional)</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm">Quest is active</label>
            </div>
          </CardContent>
        </Card>

        {/* Quest Tree Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Quest Tree Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Quest Tree (optional)</label>
              <select
                value={formData.treeId}
                onChange={(e) => setFormData({ ...formData, treeId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">No tree (standalone quest)</option>
                {trees.map((tree) => (
                  <option key={tree.id} value={tree.id}>{tree.name}</option>
                ))}
              </select>
            </div>

            {formData.treeId && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Layer</label>
                  <select
                    value={formData.layer}
                    onChange={(e) => setFormData({ ...formData, layer: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                  >
                    {layers.map((l) => (
                      <option key={l} value={l}>{l.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Order in Layer</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quest Tasks</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addTask}>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Task {index + 1}</span>
                  {tasks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  value={task.title}
                  onChange={(e) => updateTask(index, 'title', e.target.value)}
                  placeholder="Task title"
                />
                <textarea
                  value={task.description}
                  onChange={(e) => updateTask(index, 'description', e.target.value)}
                  placeholder="Task description (optional)"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background min-h-[60px]"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resources (URLs)</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addResource}>
              <Plus className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {resources.map((resource, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={resource}
                  onChange={(e) => updateResource(index, e.target.value)}
                  placeholder="https://example.com/resource"
                  className="flex-1"
                />
                {resources.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResource(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hints</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addHint}>
              <Plus className="h-4 w-4 mr-1" />
              Add Hint
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {hints.map((hint, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  placeholder="Enter a hint..."
                  className="flex-1"
                />
                {hints.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHint(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/quests">
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
