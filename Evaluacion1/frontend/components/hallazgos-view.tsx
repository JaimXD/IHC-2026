'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Save, X, Search, Eye, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastContainer } from '@/components/toast-container'
import { useToasts } from '@/hooks/use-toasts'

const hallazgoSchema = z.object({
  pruebaId: z.string().min(1, 'Selecciona una prueba'),
  frecuencia: z.string().min(1).max(50),
  severidad: z.enum(['baja', 'media', 'alta', 'critica']),
  prioridad: z.enum(['baja', 'media', 'alta']),
  estado: z.enum(['abierto', 'en_progreso', 'resuelto']),
  recomendacionMejora: z.string().min(10).max(5000),
})

type HallazgoFormValues = z.infer<typeof hallazgoSchema>

interface Hallazgo extends HallazgoFormValues {
  id: string
  createdAt: string
}

interface ApiHallazgo {
  id: number
  prueba_id: number
  frecuencia: string
  severidad: 'baja' | 'media' | 'alta' | 'critica'
  prioridad: 'baja' | 'media' | 'alta'
  estado: 'abierto' | 'en_progreso' | 'resuelto'
  recomendacion_mejora: string
  created_at?: string
}

interface ApiCreateHallazgoResponse {
  id: number
  mensaje?: string
}

interface ApiPrueba {
  id: number
  producto: string
  modulo_evaluado: string
}

interface PruebaOption {
  value: string
  label: string
}

// Solid color cube badges for severity - high contrast for instant visual recognition
const SEVERIDAD_LABELS: Record<string, { label: string; class: string; cubeClass: string }> = {
  baja: { 
    label: 'Baja', 
    class: 'bg-emerald-500 text-white border-emerald-600',
    cubeClass: 'bg-emerald-500'
  },
  media: { 
    label: 'Media', 
    class: 'bg-amber-500 text-white border-amber-600',
    cubeClass: 'bg-amber-500'
  },
  alta: { 
    label: 'Alta', 
    class: 'bg-red-500 text-white border-red-600',
    cubeClass: 'bg-red-500'
  },
  critica: { 
    label: 'Crítica', 
    class: 'bg-red-700 text-white border-red-800',
    cubeClass: 'bg-red-700'
  },
}

const PRIORIDAD_LABELS: Record<string, { label: string; class: string }> = {
  baja: { label: 'Baja', class: 'text-info' },
  media: { label: 'Media', class: 'text-warning-foreground' },
  alta: { label: 'Alta', class: 'text-destructive' },
}

const ESTADO_LABELS: Record<string, { label: string; class: string }> = {
  abierto: { label: 'Abierto', class: 'bg-info/15 text-info border-info/30' },
  en_progreso: { label: 'En Progreso', class: 'bg-warning/15 text-warning-foreground border-warning/30' },
  resuelto: { label: 'Resuelto', class: 'bg-success/15 text-success border-success/30' },
}

const EMPTY_FORM: HallazgoFormValues = {
  pruebaId: '',
  frecuencia: '',
  severidad: 'media',
  prioridad: 'media',
  estado: 'abierto',
  recomendacionMejora: '',
}

function DetailModal({
  hallazgo,
  isOpen,
  onClose,
  pruebasOptions,
}: {
  hallazgo: Hallazgo | null
  isOpen: boolean
  onClose: () => void
  pruebasOptions: PruebaOption[]
}) {
  if (!isOpen || !hallazgo) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card">
          <h3 className="text-lg font-semibold">Detalles del Hallazgo</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Prueba</p>
            <p className="text-sm font-medium">{pruebasOptions.find((p) => p.value === hallazgo.pruebaId)?.label || `Prueba ${hallazgo.pruebaId}`}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Frecuencia</p>
            <p className="text-sm">{hallazgo.frecuencia}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Severidad</p>
              <span className={`inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm ${SEVERIDAD_LABELS[hallazgo.severidad]?.class}`}>
                {SEVERIDAD_LABELS[hallazgo.severidad]?.label}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Prioridad</p>
              <p className={`text-sm font-medium ${PRIORIDAD_LABELS[hallazgo.prioridad]?.class}`}>
                {PRIORIDAD_LABELS[hallazgo.prioridad]?.label}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Estado</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${ESTADO_LABELS[hallazgo.estado]?.class}`}>
                {ESTADO_LABELS[hallazgo.estado]?.label}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Recomendación de Mejora</p>
            <p className="text-sm">{hallazgo.recomendacionMejora}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HallazgosView() {
  const [hallazgos, setHallazgos] = useState<Hallazgo[]>([])
  const [pruebasOptions, setPruebasOptions] = useState<PruebaOption[]>([])
  const [isForm, setIsForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Hallazgo | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSeveridad, setFilterSeveridad] = useState('')
  const [detailHallazgo, setDetailHallazgo] = useState<Hallazgo | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const { toasts, addToast, removeToast } = useToasts()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<HallazgoFormValues>({
    resolver: zodResolver(hallazgoSchema),
    defaultValues: EMPTY_FORM,
  })

  const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const toApiPayload = (data: HallazgoFormValues) => ({
    prueba_id: Number(data.pruebaId),
    frecuencia: data.frecuencia,
    severidad: data.severidad,
    prioridad: data.prioridad,
    estado: data.estado,
    recomendacion_mejora: data.recomendacionMejora,
  })

  const getApiErrorMessage = async (response: Response) => {
    try {
      const errorBody = await response.json()
      if (Array.isArray(errorBody?.details) && errorBody.details.length > 0) {
        return errorBody.details.join(', ')
      }
      if (Array.isArray(errorBody?.detalles) && errorBody.detalles.length > 0) {
        return errorBody.detalles.join(', ')
      }
      return errorBody?.message || 'Error desconocido al procesar la solicitud'
    } catch {
      return 'No se pudo procesar la respuesta de error del backend'
    }
  }

  useEffect(() => {
    const fetchHallazgosYPruebas = async () => {
      try {
        const [hallazgosResponse, pruebasResponse] = await Promise.all([
          fetch(`${getApiBaseUrl()}/api/hallazgos`),
          fetch(`${getApiBaseUrl()}/api/pruebas`),
        ])

        if (!hallazgosResponse.ok || !pruebasResponse.ok) {
          throw new Error('No se pudo obtener la lista de hallazgos y pruebas')
        }

        const [hallazgosData, pruebasData] = await Promise.all([
          hallazgosResponse.json() as Promise<ApiHallazgo[]>,
          pruebasResponse.json() as Promise<ApiPrueba[]>,
        ])

        const today = new Date().toISOString().split('T')[0]
        const mapped = hallazgosData.map((item) => ({
          id: String(item.id),
          pruebaId: String(item.prueba_id),
          frecuencia: item.frecuencia,
          severidad: item.severidad,
          prioridad: item.prioridad,
          estado: item.estado,
          recomendacionMejora: item.recomendacion_mejora,
          createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : today,
        }))

        const mappedPruebas = pruebasData.map((item) => ({
          value: String(item.id),
          label: `${item.producto} - ${item.modulo_evaluado}`,
        }))

        setHallazgos(mapped)
        setPruebasOptions(mappedPruebas)
      } catch (error) {
        console.error(error)
        addToast('error', 'No se pudieron cargar los hallazgos o pruebas desde el backend')
      }
    }

    fetchHallazgosYPruebas()
  }, [addToast])

  const filteredHallazgos = hallazgos.filter((h) => {
    const matchSearch = searchQuery === '' ||
      h.frecuencia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.recomendacionMejora.toLowerCase().includes(searchQuery.toLowerCase())
    const matchSeveridad = filterSeveridad === '' || h.severidad === filterSeveridad
    return matchSearch && matchSeveridad
  })

  const onSubmit = async (data: HallazgoFormValues) => {
    if (editingId) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/hallazgos/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toApiPayload(data)),
        })

        if (!response.ok) {
          const message = await getApiErrorMessage(response)
          throw new Error(message)
        }

        setHallazgos((prev) => prev.map((h) => (h.id === editingId ? { ...h, ...data } : h)))
        addToast('success', 'Hallazgo actualizado correctamente')
        setEditingId(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar el hallazgo'
        addToast('error', 'No se pudo actualizar el hallazgo', message)
        return
      }
    } else {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/hallazgos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toApiPayload(data)),
        })

        if (!response.ok) {
          const message = await getApiErrorMessage(response)
          throw new Error(message)
        }

        const created: ApiCreateHallazgoResponse = await response.json()
        const newHallazgo: Hallazgo = {
          ...data,
          id: String(created.id),
          createdAt: new Date().toISOString().split('T')[0],
        }

        setHallazgos((prev) => [...prev, newHallazgo])
        addToast('success', 'Hallazgo creado correctamente')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo crear el hallazgo'
        addToast('error', 'No se pudo crear el hallazgo', message)
        return
      }
    }
    setIsForm(false)
    reset()
  }

  const handleEdit = (hallazgo: Hallazgo) => {
    setEditingId(hallazgo.id)
    Object.keys(hallazgo).forEach((key) => {
      if (key !== 'id' && key !== 'createdAt') {
        setValue(key as keyof HallazgoFormValues, (hallazgo as any)[key])
      }
    })
    setIsForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = async (hallazgo: Hallazgo) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/hallazgos/${hallazgo.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const message = await getApiErrorMessage(response)
        throw new Error(message)
      }

      setHallazgos((prev) => prev.filter((h) => h.id !== hallazgo.id))
      addToast('success', 'Hallazgo eliminado correctamente')
      setDeleteConfirm(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el hallazgo'
      addToast('error', 'No se pudo eliminar el hallazgo', message)
    }
  }

  const handleViewDetails = (hallazgo: Hallazgo) => {
    setDetailHallazgo(hallazgo)
    setDetailModalOpen(true)
    setOpenMenuId(null)
  }

  if (isForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              setIsForm(false)
              reset()
              setEditingId(null)
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Volver"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">{editingId ? 'Editar Hallazgo' : 'Crear Hallazgo'}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-1">Prueba</label>
            <select
              {...register('pruebaId')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">Selecciona una prueba</option>
              {pruebasOptions.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            {errors.pruebaId && <p className="text-destructive text-xs mt-1">{errors.pruebaId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frecuencia</label>
            <input
              type="text"
              placeholder="Ej: 5 de 8 participantes"
              {...register('frecuencia')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.frecuencia && <p className="text-destructive text-xs mt-1">{errors.frecuencia.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Severidad</label>
              <select
                {...register('severidad')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prioridad</label>
              <select
                {...register('prioridad')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                {...register('estado')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="abierto">Abierto</option>
                <option value="en_progreso">En Progreso</option>
                <option value="resuelto">Resuelto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Recomendación de Mejora</label>
            <textarea
              placeholder="Describe la recomendación de mejora"
              {...register('recomendacionMejora')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
            />
            {errors.recomendacionMejora && <p className="text-destructive text-xs mt-1">{errors.recomendacionMejora.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsForm(false)
                reset()
                setEditingId(null)
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Síntesis de Hallazgos</h2>
        <Button onClick={() => { setIsForm(true); reset(); setEditingId(null) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Hallazgo
        </Button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por frecuencia o recomendación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={filterSeveridad}
          onChange={(e) => setFilterSeveridad(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        >
          <option value="">Todas las severidades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredHallazgos.map((hallazgo) => (
          <div key={hallazgo.id} className="border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-card relative group cursor-pointer" onClick={() => handleViewDetails(hallazgo)}>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenMenuId(openMenuId === hallazgo.id ? null : hallazgo.id)
                }}
                className="absolute -top-2 -right-2 p-2 hover:bg-secondary rounded-lg transition-colors z-10"
                aria-label="Más opciones"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </button>

              {openMenuId === hallazgo.id && (
                <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetails(hallazgo)
                    }}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(hallazgo)
                    }}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirm(hallazgo)
                      setOpenMenuId(null)
                    }}
                    className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Solid color cube/badge for severity */}
              <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide text-center shadow-sm ${SEVERIDAD_LABELS[hallazgo.severidad]?.class}`}>
                {SEVERIDAD_LABELS[hallazgo.severidad]?.label}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${ESTADO_LABELS[hallazgo.estado]?.class}`}>
                {ESTADO_LABELS[hallazgo.estado]?.label}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium text-center ${PRIORIDAD_LABELS[hallazgo.prioridad]?.class}`}>
                P. {PRIORIDAD_LABELS[hallazgo.prioridad]?.label}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-2">Frecuencia: <span className="font-medium text-foreground">{hallazgo.frecuencia}</span></p>
            <p className="text-sm line-clamp-2">{hallazgo.recomendacionMejora}</p>
          </div>
        ))}
      </div>

      {filteredHallazgos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron hallazgos</p>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Eliminar hallazgo</h3>
            <p className="text-sm text-muted-foreground mb-6">¿Estás seguro que deseas eliminar este hallazgo? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Eliminar
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <DetailModal
        hallazgo={detailHallazgo}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        pruebasOptions={pruebasOptions}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
