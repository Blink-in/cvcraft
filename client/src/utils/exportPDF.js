/**
 * Export CV as PDF using browser's print-to-PDF.
 * Opens a new window with the CV preview and triggers print dialog.
 */
export async function exportCVasPDF(cv) {
  // Dynamically import to keep bundle lean
  const { default: CVPreviewForExport } = await import('../components/cv/CVPreview.jsx')
  const { createRoot } = await import('react-dom/client')
  const React = await import('react')

  const win = window.open('', '_blank')
  if (!win) { alert('Please allow popups to export PDF.'); return }

  const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />`

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${cv.title}</title>
        ${fontLink}
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: white; }
          #cv-preview-root { box-shadow: none !important; overflow: visible !important; width: 794px !important; }
          .cv-page-boundary { display: none !important; }
          @page { size: A4; margin: 0; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body><div id="root"></div></body>
    </html>
  `)
  win.document.close()

  // Wait for fonts
  await new Promise(r => setTimeout(r, 800))

  const root = createRoot(win.document.getElementById('root'))
  root.render(React.createElement(CVPreviewForExport, { cv, forExport: true }))

  await new Promise(r => setTimeout(r, 600))
  win.focus()
  win.print()
}

/**
 * Export Cover Letter as PDF
 */
export async function downloadCoverLetterPDF(cl) {
  const win = window.open('', '_blank')
  if (!win) { alert('Please allow popups to export PDF.'); return }

  const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />`

  function parseHtml(html) {
    if (!html) return ''
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
  }

  const accent = cl.customization?.accentColor || '#c9a84c'
  const primary = cl.customization?.primaryColor || '#1a1814'
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${cl.title}</title>
        ${fontLink}
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', sans-serif; font-size: 13.5px; line-height: 1.6; color: #1a1814; background: white; }
          @page { size: A4; margin: 0; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          .header { background: ${primary}; padding: 32px 52px 24px; }
          .accent-bar { height: 3px; background: linear-gradient(to right, ${accent}, transparent); }
          .body { padding: 40px 52px; white-space: pre-wrap; line-height: 1.8; color: #2a2824; }
          h1 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: #faf8f3; }
          .subtitle { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: ${accent}; margin-top: 5px; }
          .date { font-size: 11px; color: rgba(250,248,243,0.5); }
          .header-row { display: flex; justify-content: space-between; align-items: flex-start; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-row">
            <div>
              <h1>Cover Letter</h1>
              ${cl.jobTitle && cl.company ? `<p class="subtitle">${cl.jobTitle} · ${cl.company}</p>` : ''}
            </div>
            <p class="date">${today}</p>
          </div>
        </div>
        <div class="accent-bar"></div>
        <div class="body">${cl.hiringManager ? `Dear ${cl.hiringManager},\n\n` : ''}${parseHtml(cl.content)}</div>
      </body>
    </html>
  `)
  win.document.close()
  await new Promise(r => setTimeout(r, 600))
  win.focus()
  win.print()
}
