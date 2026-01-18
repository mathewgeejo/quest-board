'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { QuestTreeGrid } from '@/components/quest'
import { TreeCardSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function TreesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [trees, setTrees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    fetchTrees()
  }, [selectedLayer])
  
  const fetchTrees = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedLayer) params.append('layer', selectedLayer)
      
      const res = await fetch(`/api/trees?${params}`)
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
  
  const layers = [
    { value: null, label: 'All Layers' },
    { value: 'FOUNDATIONS', label: 'Foundations' },
    { value: 'TOOL_MASTERY', label: 'Tool Mastery' },
    { value: 'SPECIALIZATION', label: 'Specialization' },
    { value: 'CAPSTONE', label: 'Capstone' },
  ]
  
  const filteredTrees = trees.filter((tree) =>
    tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tree.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (status === 'loading') {
    return (
      <DashboardLayout title="Quest Trees">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <TreeCardSkeleton key={i} />
          ))}
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title="Quest Trees"
      subtitle="Explore learning paths organized by skill area"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quest trees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {layers.map((layer) => (
              <Button
                key={layer.value || 'all'}
                variant={selectedLayer === layer.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLayer(layer.value)}
              >
                {layer.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Trees Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <TreeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTrees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? 'No quest trees match your search'
                : 'No quest trees available'}
            </p>
          </div>
        ) : (
          <QuestTreeGrid trees={filteredTrees} />
        )}
      </div>
    </DashboardLayout>
  )
}
