'use client'

import React from 'react'
import CMSEditor from '@/components/admin/CMSEditor'
import { useCMSContent } from '@/hooks/useCMSContent'

export default function AdminHomeEditor() {
  const { content, refetch } = useCMSContent('home')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Home Page Editor</h2>

      <CMSEditor
        page="home" section="hero"
        fields={[
          { key: 'title', label: 'Hero Title', type: 'text', currentValue: content.hero?.title },
          { key: 'subtitle', label: 'Subtitle', type: 'text', currentValue: content.hero?.subtitle },
          { key: 'cta_text', label: 'Button Text', type: 'text', currentValue: content.hero?.cta_text },
          { key: 'cta_link', label: 'Button Link', type: 'url', currentValue: content.hero?.cta_link },
          { key: 'image_url', label: 'Hero Image', type: 'image', currentValue: content.hero?.image_url, bucket: 'banner-images', folder: 'home' }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="home" section="about_snippet"
        fields={[
          { key: 'heading', label: 'Heading', type: 'text', currentValue: content.about_snippet?.heading },
          { key: 'body', label: 'Body', type: 'textarea', currentValue: content.about_snippet?.body },
          { key: 'image_url', label: 'Image', type: 'image', currentValue: content.about_snippet?.image_url, bucket: 'cms-images', folder: 'home' }
        ]}
        onSaved={refetch}
      />
    </div>
  )
}
