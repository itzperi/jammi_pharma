'use client'

import React from 'react'
import CMSEditor from '@/components/admin/CMSEditor'
import { useCMSContent } from '@/hooks/useCMSContent'

export default function AdminShopEditor() {
  const { content, refetch } = useCMSContent('shop')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shop Page Editor</h2>

      <CMSEditor
        page="shop" section="hero"
        fields={[
          { key: 'title', label: 'Page Title', type: 'text', currentValue: content.hero?.title },
          { key: 'description', label: 'Description', type: 'textarea', currentValue: content.hero?.description },
          { key: 'banner_image', label: 'Banner Image', type: 'image', currentValue: content.hero?.banner_image, bucket: 'cms-images', folder: 'shop' }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="shop" section="promo"
        fields={[
          { key: 'text', label: 'Promo Text', type: 'text', currentValue: content.promo?.text },
          { key: 'discount_code', label: 'Discount Code', type: 'text', currentValue: content.promo?.discount_code }
        ]}
        onSaved={refetch}
      />
    </div>
  )
}
