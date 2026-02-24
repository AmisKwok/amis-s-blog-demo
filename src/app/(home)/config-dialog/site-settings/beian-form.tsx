'use client'

import type { SiteContent } from '../../stores/config-store'
import { useLanguage } from '@/i18n/context'

interface BeianFormProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

export function BeianForm({ formData, setFormData }: BeianFormProps) {
	const { t } = useLanguage()

	return (
		<div className='space-y-2'>
			<label className='mb-2 block text-sm font-medium'>{t('siteSettings.beian.title')}</label>
			<div className='grid grid-cols-2 gap-2'>
				<div>
					<label className='mb-1 block text-xs text-gray-600'>{t('siteSettings.beian.number')}</label>
					<input
						type='text'
						value={formData.beian?.text || ''}
						onChange={e => setFormData({ ...formData, beian: { ...(formData.beian || { text: '', link: '' }), text: e.target.value } })}
						placeholder={t('siteSettings.beian.placeholder')}
						className='bg-secondary/10 w-full rounded-lg border px-4 py-2 text-sm'
					/>
				</div>
				<div>
					<label className='mb-1 block text-xs text-gray-600'>{t('siteSettings.beian.link')}</label>
					<input
						type='url'
						value={formData.beian?.link || ''}
						onChange={e => setFormData({ ...formData, beian: { ...(formData.beian || { text: '', link: '' }), link: e.target.value } })}
						placeholder='https://beian.miit.gov.cn/'
						className='bg-secondary/10 w-full rounded-lg border px-4 py-2 text-sm'
					/>
				</div>
			</div>
		</div>
	)
}

