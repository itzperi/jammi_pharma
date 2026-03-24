'use client'

import React from 'react'
import CMSEditor from '@/components/admin/CMSEditor'
import { useCMSContent } from '@/hooks/useCMSContent'

export default function AdminLegacyEditor() {
  const { content, refetch } = useCMSContent('legacy')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Legacy Page Editor</h2>

      <CMSEditor
        page="legacy" section="hero"
        fields={[
          { key: 'est', label: 'Established Text', type: 'text', currentValue: content.hero?.est },
          { key: 'headline', label: 'Hero Headline', type: 'text', currentValue: content.hero?.headline },
          { key: 'subtext', label: 'Hero Subtext', type: 'textarea', currentValue: content.hero?.subtext },
          { key: 'button_1', label: 'Button 1 Text', type: 'text', currentValue: content.hero?.button_1 },
          { key: 'button_2', label: 'Button 2 Text', type: 'text', currentValue: content.hero?.button_2 },
          { key: 'bg_image', label: 'Background Image', type: 'image', currentValue: content.hero?.bg_image, bucket: 'site-assets', folder: 'heritage' }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="legacy" section="founder"
        fields={[
          { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', currentValue: content.founder?.eyebrow },
          { key: 'title', label: 'Headline', type: 'text', currentValue: content.founder?.title },
          { key: 'text_1', label: 'Paragraph 1', type: 'textarea', currentValue: content.founder?.text_1 },
          { key: 'text_2', label: 'Paragraph 2', type: 'textarea', currentValue: content.founder?.text_2 },
          { key: 'quote', label: 'Blockquote', type: 'textarea', currentValue: content.founder?.quote },
          { key: 'name', label: 'Founder Name', type: 'text', currentValue: content.founder?.name },
          { key: 'subtitle', label: 'Founder Subtitle', type: 'text', currentValue: content.founder?.subtitle },
          { key: 'image', label: 'Founder Image', type: 'image', currentValue: content.founder?.image, bucket: 'site-assets', folder: 'heritage' }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="legacy" section="milestones"
        fields={[
          { key: 'title', label: 'Section Title', type: 'text', currentValue: content.milestones?.title },
          { key: 'm1_year', label: 'Milestone 1 Year', type: 'text', currentValue: content.milestones?.m1_year },
          { key: 'm1_title', label: 'Milestone 1 Title', type: 'text', currentValue: content.milestones?.m1_title },
          { key: 'm1_desc', label: 'Milestone 1 Description', type: 'textarea', currentValue: content.milestones?.m1_desc },
          { key: 'm2_year', label: 'Milestone 2 Year', type: 'text', currentValue: content.milestones?.m2_year },
          { key: 'm2_title', label: 'Milestone 2 Title', type: 'text', currentValue: content.milestones?.m2_title },
          { key: 'm2_desc', label: 'Milestone 2 Description', type: 'textarea', currentValue: content.milestones?.m2_desc },
          { key: 'm3_year', label: 'Milestone 3 Year', type: 'text', currentValue: content.milestones?.m3_year },
          { key: 'm3_title', label: 'Milestone 3 Title', type: 'text', currentValue: content.milestones?.m3_title },
          { key: 'm3_desc', label: 'Milestone 3 Description', type: 'textarea', currentValue: content.milestones?.m3_desc },
          { key: 'm4_year', label: 'Milestone 4 Year', type: 'text', currentValue: content.milestones?.m4_year },
          { key: 'm4_title', label: 'Milestone 4 Title', type: 'text', currentValue: content.milestones?.m4_title },
          { key: 'm4_desc', label: 'Milestone 4 Description', type: 'textarea', currentValue: content.milestones?.m4_desc },
          { key: 'm5_year', label: 'Milestone 5 Year', type: 'text', currentValue: content.milestones?.m5_year },
          { key: 'm5_title', label: 'Milestone 5 Title', type: 'text', currentValue: content.milestones?.m5_title },
          { key: 'm5_desc', label: 'Milestone 5 Description', type: 'textarea', currentValue: content.milestones?.m5_desc }
        ]}
        onSaved={refetch}
      />

      <CMSEditor
        page="legacy" section="gallery"
        fields={[
          { key: 'title', label: 'Gallery Title', type: 'text', currentValue: content.gallery?.title },
          { key: 'desc', label: 'Gallery Description', type: 'textarea', currentValue: content.gallery?.desc },
          { key: 'img_1', label: 'Image 1', type: 'image', currentValue: content.gallery?.img_1, bucket: 'site-assets', folder: 'heritage' },
          { key: 'g1_date', label: 'Image 1 Date', type: 'text', currentValue: content.gallery?.g1_date },
          { key: 'g1_title', label: 'Image 1 Title', type: 'text', currentValue: content.gallery?.g1_title },
          { key: 'g1_desc', label: 'Image 1 Description', type: 'textarea', currentValue: content.gallery?.g1_desc },
          { key: 'img_2', label: 'Image 2', type: 'image', currentValue: content.gallery?.img_2, bucket: 'site-assets', folder: 'heritage' },
          { key: 'g2_date', label: 'Image 2 Date', type: 'text', currentValue: content.gallery?.g2_date },
          { key: 'g2_title', label: 'Image 2 Title', type: 'text', currentValue: content.gallery?.g2_title },
          { key: 'g2_desc', label: 'Image 2 Description', type: 'textarea', currentValue: content.gallery?.g2_desc },
          { key: 'img_3', label: 'Image 3', type: 'image', currentValue: content.gallery?.img_3, bucket: 'site-assets', folder: 'heritage' },
          { key: 'g3_date', label: 'Image 3 Date', type: 'text', currentValue: content.gallery?.g3_date },
          { key: 'g3_title', label: 'Image 3 Title', type: 'text', currentValue: content.gallery?.g3_title },
          { key: 'g3_desc', label: 'Image 3 Description', type: 'textarea', currentValue: content.gallery?.g3_desc }
        ]}
        onSaved={refetch}
      />
    </div>
  )
}
