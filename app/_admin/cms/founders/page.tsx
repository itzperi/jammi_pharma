'use client'

import React from 'react'
import CMSEditor from '@/components/admin/CMSEditor'
import { useCMSContent } from '@/hooks/useCMSContent'

export default function AdminFoundersEditor() {
  const { content, refetch } = useCMSContent('founders')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Founders Page Editor</h2>

      <CMSEditor
        page="founders" section="hero"
        fields={[
          { key: 'title', label: 'Page Title', type: 'text', currentValue: content.hero?.title },
          { key: 'subtitle', label: 'Subtitle', type: 'text', currentValue: content.hero?.subtitle },
          { key: 'image_url', label: 'Hero Image', type: 'image', currentValue: content.hero?.image_url, bucket: 'cms-images', folder: 'founders' }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="founders" section="founder_1"
        fields={[
          { key: 'name', label: 'Founder Name', type: 'text', currentValue: content.founder_1?.name },
          { key: 'title', label: 'Title/Role', type: 'text', currentValue: content.founder_1?.title },
          { key: 'bio', label: 'Biography', type: 'textarea', currentValue: content.founder_1?.bio },
          { key: 'image_url', label: 'Photo', type: 'image', currentValue: content.founder_1?.image_url, bucket: 'cms-images', folder: 'founders' }
        ]}
        onSaved={refetch}
      />
    </div>
  )
}
