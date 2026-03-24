'use client'

import React from 'react'
import CMSEditor from '@/components/admin/CMSEditor'
import { useCMSContent } from '@/hooks/useCMSContent'

export default function AdminFederationEditor() {
  const { content, refetch } = useCMSContent('federation')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Federation Page Editor</h2>

      <CMSEditor
        page="federation" section="hero"
        fields={[
          { key: 'title', label: 'Page Title', type: 'text', currentValue: content.hero?.title },
          { key: 'description', label: 'Description', type: 'textarea', currentValue: content.hero?.description },
          { key: 'banner_image', label: 'Banner Image', type: 'image', currentValue: content.hero?.banner_image, bucket: 'cms-images', folder: 'federation' }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="federation" section="partner_cta"
        fields={[
          { key: 'heading', label: 'Partner Section Heading', type: 'text', currentValue: content.partner_cta?.heading },
          { key: 'body', label: 'Partner Description', type: 'textarea', currentValue: content.partner_cta?.body },
          { key: 'button_text', label: 'Button Text', type: 'text', currentValue: content.partner_cta?.button_text }
        ]}
        onSaved={refetch}
      />
    </div>
  )
}
