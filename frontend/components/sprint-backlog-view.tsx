"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sparkles, FileText, Download, Loader2, Bot, Target, FileStack, LayoutPanelLeft, Code2, Beaker, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function SprintBacklogView() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setDashboardData(null)
    
    try {
      const res = await fetch("http://localhost:3001/api/sprint-backlog/generate", {
        method: "POST",
      })
      
      if (!res.ok) throw new Error("Error al comunicarse con la IA del servidor")
      
      const response = await res.json()
      
      setDashboardData(response.data)
      
      if (response.metadata?.aiSource === 'local-fallback') {
        toast.warning("Gemini sobrecargado. Se utilizó el generador local de respaldo.")
      } else {
        toast.success("Dashboard generado con éxito por Gemini")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al generar el backlog. Revisa el backend.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = () => {
    toast.info("Abre el diálogo de impresión y selecciona 'Guardar como PDF'")
    setTimeout(() => {
      window.print()
    }, 1000)
  }

  const handleExportMD = () => {
    if (!dashboardData) return;
    
    const d = dashboardData;
    let md = `# ${d.dashboardData.bannerMeta.titulo}\n\n`;
    md += `> **Meta:** ${d.dashboardData.bannerMeta.descripcion}\n\n`;
    md += `${d.dashboardData.resumenEjecutivo}\n\n`;
    
    md += `## 📊 KPIs del Sprint\n`;
    md += `- **Total Historias:** ${d.dashboardData.kpisPrincipales.totalHistorias}\n`;
    md += `- **Puntos de Esfuerzo:** ${d.dashboardData.kpisPrincipales.puntosEsfuerzoTotal}\n`;
    md += `- **Tareas Diseño:** ${d.dashboardData.kpisPrincipales.tareasDiseno}\n`;
    md += `- **Tareas Desarrollo:** ${d.dashboardData.kpisPrincipales.tareasDesarrollo}\n\n`;
    md += `---\n\n`;

    md += `## 👤 Historias de Usuario\n`;
    md += `| ID | Título | Prioridad | Puntos | Descripción |\n`;
    md += `|---|---|---|---|---|\n`;
    d.historiasUsuario.forEach((us: any) => {
      md += `| ${us.id} | ${us.titulo} | ${us.prioridad} | ${us.puntos} | ${us.descripcion} |\n`;
    });
    md += `\n---\n\n`;

    md += `## 🛠️ Desglose de Tareas Técnicas\n\n`;
    
    md += `### 🎨 UX/UI & Diseño\n`;
    d.desgloseTareas.uiux.forEach((t: any) => md += `- [ ] ${t.texto}\n`);
    md += `\n`;
    
    md += `### ⚙️ Desarrollo (Dev)\n`;
    d.desgloseTareas.desarrollo.forEach((t: any) => md += `- [ ] ${t.texto}\n`);
    md += `\n`;
    
    md += `### 🧪 QA y Pruebas\n`;
    d.desgloseTareas.qa.forEach((t: any) => md += `- [ ] ${t.texto}\n`);
    md += `\n---\n\n`;

    md += `## ✅ Criterios de Aceptación Globales\n`;
    d.criteriosAceptacionGlobales.forEach((c: string) => md += `- ${c}\n`);

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sprint_backlog.md"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Archivo Markdown exportado correctamente")
  }


  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            Tablero de Planificación Ágil (IA)
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Convierte automáticamente tus hallazgos de usabilidad en un Sprint Backlog accionable.
          </p>
        </div>
        
        {dashboardData && (
           <div className="flex gap-2">
             <Button variant="outline" onClick={handleExportMD} className="gap-2">
               <FileText className="w-4 h-4" />
               Exportar MD
             </Button>
             <Button variant="outline" onClick={handleExportPDF} className="gap-2">
               <Download className="w-4 h-4" />
               Exportar PDF
             </Button>
             <Button onClick={handleGenerate} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
               <Sparkles className="w-4 h-4" />
               Regenerar
             </Button>
           </div>
        )}
      </div>

      {!dashboardData && !isGenerating && (
        <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
          <CardHeader>
            <CardTitle className="text-indigo-800 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Asistente Inteligente Gemini
            </CardTitle>
            <CardDescription>
              Gemini analizará los datos y construirá un tablero completo con KPIs y tareas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 animate-pulse" />
               <Sparkles className="w-10 h-10 text-indigo-600 relative z-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-800">Genera tu Sprint en segundos</h3>
            <p className="text-slate-500 mb-6 text-center max-w-md">
              La IA convertirá cada hallazgo en Historias de Usuario priorizadas y tareas técnicas.
            </p>
            <Button size="lg" onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-full px-8 shadow-md hover:shadow-lg transition-all">
              <Sparkles className="w-4 h-4" />
              Construir Dashboard Ágil
            </Button>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card className="border-border shadow-sm">
           <CardContent className="flex flex-col items-center justify-center py-20 bg-slate-50/30">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
              </div>
              <p className="text-slate-800 font-medium text-lg">Procesando hallazgos con Gemini...</p>
              <p className="text-sm text-slate-500 mt-2">Calculando KPIs, redactando historias y dividiendo tareas.</p>
           </CardContent>
        </Card>
      )}

      {dashboardData && !isGenerating && (
        <div className="space-y-6 print:space-y-4">
          
          {/* Banner Meta del Sprint */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-3">
                 <Target className="w-6 h-6 text-indigo-200" />
                 <h2 className="text-xl font-bold text-indigo-50">{dashboardData.dashboardData.bannerMeta.titulo}</h2>
               </div>
               <p className="text-2xl sm:text-3xl font-semibold leading-tight mb-4">
                 {dashboardData.dashboardData.bannerMeta.descripcion}
               </p>
               <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                 <p className="text-sm text-indigo-100">{dashboardData.dashboardData.resumenEjecutivo}</p>
               </div>
             </div>
          </div>

          {/* KPIs Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Card className="bg-white border-slate-200/60 shadow-sm">
               <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                   <div className="space-y-1">
                     <p className="text-sm font-medium text-slate-500">Total Historias</p>
                     <p className="text-3xl font-bold text-slate-800">{dashboardData.dashboardData.kpisPrincipales.totalHistorias}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <FileStack className="w-5 h-5" />
                   </div>
                 </div>
               </CardContent>
             </Card>
             <Card className="bg-white border-slate-200/60 shadow-sm">
               <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                   <div className="space-y-1">
                     <p className="text-sm font-medium text-slate-500">Puntos de Esfuerzo</p>
                     <p className="text-3xl font-bold text-slate-800">{dashboardData.dashboardData.kpisPrincipales.puntosEsfuerzoTotal}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                     <Sparkles className="w-5 h-5" />
                   </div>
                 </div>
               </CardContent>
             </Card>
             <Card className="bg-white border-slate-200/60 shadow-sm">
               <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                   <div className="space-y-1">
                     <p className="text-sm font-medium text-slate-500">Tareas Diseño</p>
                     <p className="text-3xl font-bold text-slate-800">{dashboardData.dashboardData.kpisPrincipales.tareasDiseno}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                     <LayoutPanelLeft className="w-5 h-5" />
                   </div>
                 </div>
               </CardContent>
             </Card>
             <Card className="bg-white border-slate-200/60 shadow-sm">
               <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                   <div className="space-y-1">
                     <p className="text-sm font-medium text-slate-500">Tareas Desarrollo</p>
                     <p className="text-3xl font-bold text-slate-800">{dashboardData.dashboardData.kpisPrincipales.tareasDesarrollo}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                     <Code2 className="w-5 h-5" />
                   </div>
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Tabla de Historias de Usuario */}
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg text-slate-800">Historias de Usuario (Product Backlog)</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Prioridad</th>
                    <th className="px-6 py-4 font-medium">Puntos</th>
                    <th className="px-6 py-4 font-medium min-w-[200px]">Título</th>
                    <th className="px-6 py-4 font-medium min-w-[300px]">Descripción (Como, Quiero, Para)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData.historiasUsuario.map((us: any) => (
                    <tr key={us.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900 whitespace-nowrap">{us.id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          us.prioridad.toLowerCase().includes('alta') ? 'bg-red-100 text-red-700' :
                          us.prioridad.toLowerCase().includes('media') ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {us.prioridad}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                           {us.puntos}
                         </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{us.titulo}</td>
                      <td className="px-6 py-4">{us.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Tareas Técnicas */}
             <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Desglose de Tareas Técnicas
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {/* UX/UI Card */}
                   <Card className="border-indigo-100 shadow-sm">
                     <CardHeader className="pb-3 bg-indigo-50/30">
                       <CardTitle className="text-base text-indigo-900 flex items-center gap-2">
                         <LayoutPanelLeft className="w-4 h-4 text-indigo-600" />
                         UX/UI & Diseño
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-4">
                       <ul className="space-y-3">
                         {dashboardData.desgloseTareas.uiux.map((t: any) => (
                           <li key={t.id} className="flex items-start gap-3 text-sm text-slate-600">
                             <div className="mt-0.5 min-w-[16px]"><CheckCircle2 className="w-4 h-4 text-slate-300" /></div>
                             <span className="leading-tight">{t.texto}</span>
                           </li>
                         ))}
                       </ul>
                     </CardContent>
                   </Card>

                   {/* Desarrollo Card */}
                   <Card className="border-blue-100 shadow-sm">
                     <CardHeader className="pb-3 bg-blue-50/30">
                       <CardTitle className="text-base text-blue-900 flex items-center gap-2">
                         <Code2 className="w-4 h-4 text-blue-600" />
                         Desarrollo (Dev)
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-4">
                       <ul className="space-y-3">
                         {dashboardData.desgloseTareas.desarrollo.map((t: any) => (
                           <li key={t.id} className="flex items-start gap-3 text-sm text-slate-600">
                             <div className="mt-0.5 min-w-[16px]"><CheckCircle2 className="w-4 h-4 text-slate-300" /></div>
                             <span className="leading-tight">{t.texto}</span>
                           </li>
                         ))}
                       </ul>
                     </CardContent>
                   </Card>
                </div>
             </div>

             {/* Criterios y QA */}
             <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-emerald-500" />
                  Calidad y Criterios
                </h3>
                
                <Card className="border-emerald-100 shadow-sm h-full">
                  <CardHeader className="pb-3 bg-emerald-50/30 border-b border-emerald-100/50">
                    <CardTitle className="text-base text-emerald-900">Criterios de Aceptación Globales</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                    <ul className="space-y-3">
                      {dashboardData.criteriosAceptacionGlobales.map((c: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="min-w-[8px] h-2 w-2 mt-1.5 rounded-full bg-emerald-400" />
                          <span className="leading-snug">{c}</span>
                        </li>
                      ))}
                    </ul>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" /> Tareas de Pruebas (QA)
                      </h4>
                      <ul className="space-y-2">
                        {dashboardData.desgloseTareas.qa.map((t: any) => (
                          <li key={t.id} className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{t.id}</span>
                            {t.texto}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
             </div>
          </div>

        </div>
      )}

      {/* Estilos para impresión */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #sidebar, header, button { display: none !important; }
          .max-w-6xl, .max-w-6xl * { visibility: visible; }
          .max-w-6xl { position: absolute; left: 0; top: 0; width: 100% !important; padding: 0 !important; }
          .shadow-sm, .shadow-lg { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          .bg-gradient-to-r { background: #3b82f6 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
          .bg-indigo-50, .bg-blue-50, .bg-slate-50, .bg-emerald-50, .bg-pink-50, .bg-purple-50 { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }
        }
      `}} />
    </div>
  )
}
