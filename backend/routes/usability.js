const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

// POST /api/usability/results
router.post('/results', (req, res) => {
  try {
    const body = req.body || {}
    const outDir = path.resolve(__dirname, '..', '..', 'docs', 'usability', 'evidencias')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    const outFile = path.join(outDir, 'usability_results.jsonl')
    const line = JSON.stringify({ ts: new Date().toISOString(), ...body }) + '\n'
    fs.appendFileSync(outFile, line, 'utf8')
    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error('Error saving usability result', err)
    return res.status(500).json({ ok: false, error: 'No se pudo guardar el resultado' })
  }
})

module.exports = router
