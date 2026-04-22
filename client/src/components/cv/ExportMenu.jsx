import { useState } from 'react'
import { X, FileDown, FileJson, Printer, Loader2 } from 'lucide-react'
import { exportCVasPDF } from '../../utils/exportPDF.js'
import { downloadJSON } from '../../utils/io.js'

export default function ExportMenu({ cv, onClose }) {
  const [loading, setLoading] = useState(null)

  const handlePDF = async () => {
    setLoading('pdf')
    try {
      await exportCVasPDF(cv)
    } finally {
      setLoading(null)
    }
  }

  const handleJSON = () => {
    setLoading('json')
    const json = JSON.stringify({ cv }, null, 2)
    downloadJSON(json, `${cv.title.replace(/\s+/g, '-').toLowerCase()}.json`)
    setTimeout(() => setLoading(null), 600)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-sm p-5 z-10 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Export Document</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={15} /></button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handlePDF}
            disabled={loading === 'pdf'}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-obsidian-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              {loading === 'pdf' ? <Loader2 size={18} className="text-red-400 animate-spin" /> : <FileDown size={18} className="text-red-400" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-obsidian-100">Download PDF</p>
              <p className="text-xs text-obsidian-500 mt-0.5">High-fidelity print-ready export</p>
            </div>
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-obsidian-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Printer size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-obsidian-100">Print / Save as PDF</p>
              <p className="text-xs text-obsidian-500 mt-0.5">Use browser's native print dialog</p>
            </div>
          </button>

          <button
            onClick={handleJSON}
            disabled={loading === 'json'}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-obsidian-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              {loading === 'json' ? <Loader2 size={18} className="text-emerald-400 animate-spin" /> : <FileJson size={18} className="text-emerald-400" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-obsidian-100">Export as JSON</p>
              <p className="text-xs text-obsidian-500 mt-0.5">Backup & restore your CV data</p>
            </div>
          </button>
        </div>

        <p className="text-[10px] text-obsidian-600 text-center mt-4 leading-relaxed">
          PDF export uses your browser's print engine for best fidelity.<br />
          JSON export lets you restore this CV on any device.
        </p>
      </div>
    </div>
  )
}
