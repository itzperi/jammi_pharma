'use client'

import React from 'react'
import CMSEditor from '@/components/admin/CMSEditor'
import { useCMSContent } from '@/hooks/useCMSContent'

export default function AdminAboutEditor() {
  const { content, refetch } = useCMSContent('about')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">About Page Editor</h2>

      <CMSEditor
        page="about" section="hero"
        fields={[
          { key: 'title', label: 'Page Title', type: 'text', currentValue: content.hero?.title },
          { key: 'description', label: 'Description', type: 'textarea', currentValue: content.hero?.description },
          { key: 'banner_image', label: 'Banner Image', type: 'image', currentValue: content.hero?.banner_image, bucket: 'cms-images', folder: 'about' }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="about" section="mission"
        fields={[
          { key: 'heading', label: 'Mission Heading', type: 'text', currentValue: content.mission?.heading },
          { key: 'body', label: 'Mission Statement', type: 'textarea', currentValue: content.mission?.body }
        ]}
        onSaved={refetch}
      />
    </div>
  )
}
