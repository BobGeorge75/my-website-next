'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './admin.module.css'

export default function UploadForm() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Please select a file.'); return }
    if (!name.trim()) { setError('Please enter a document name.'); return }

    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = createClient()

    // Upload file to storage
    const filePath = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      setLoading(false)
      setError(uploadError.message)
      return
    }

    // Insert document row
    const { error: insertError } = await supabase
      .from('documents')
      .insert({ name: name.trim(), description: description.trim() || null, file_path: filePath })

    setLoading(false)

    if (insertError) {
      // Clean up the orphaned file
      await supabase.storage.from('documents').remove([filePath])
      setError(insertError.message)
      return
    }

    setSuccess(`"${name}" uploaded successfully.`)
    setName('')
    setDescription('')
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    router.refresh()
  }

  return (
    <form onSubmit={handleUpload} className={styles.uploadForm}>
      <h3 className={styles.uploadTitle}>Upload Document</h3>

      <div className={styles.field}>
        <label htmlFor="docFile">File</label>
        <input
          id="docFile"
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className={styles.fileInput}
        />
        {file && <span className={styles.fileName}>{file.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="docName">Document Name</label>
        <input
          id="docName"
          type="text"
          placeholder="e.g. Meeting Minutes – March 2025"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="docDesc">Description <span>(optional)</span></label>
        <input
          id="docDesc"
          type="text"
          placeholder="Brief description of the document"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.successMsg}>{success}</p>}

      <button type="submit" className={styles.btnPrimary} disabled={loading}>
        {loading ? 'Uploading…' : 'Upload Document'}
      </button>
    </form>
  )
}
