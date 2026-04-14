import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { InstitutionProfile } from '@/types'
import { useToastStore } from './toast'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

const defaultProfile: InstitutionProfile = {
  id: 'tenant_default',
  slug: 'delhi-public-school',
  name: 'Delhi Public School',
  type: 'school',
  logo_url: '',
  address: '123 Education Lane',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110001',
  phone: '011-2345-6789',
  email: 'info@dps-school.edu',
  website_url: '',
  board_affiliation: 'CBSE',
  udise_code: '07071234567',
  principal_name: 'Dr. Rakesh Kumar',
  principal_photo_url: '',
  principal_designation: 'Principal & Director',
  principal_message:
    "We believe in nurturing every child's potential through academic excellence, moral values, and holistic development. Our institution is committed to creating future leaders who will make a positive impact on society.",
  established_year: 1998,
  motto: 'Knowledge is Power',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  social_youtube: '',
  public_website_enabled: true,
  website_theme: 'professional',
  website_hero_title: '',
  website_hero_subtitle: '',
  website_hero_image_url: '',
  website_about_title: '',
  website_about_description: '',
  website_about_image_url: '',
  website_gallery_images: [],
  website_primary_cta_text: '',
  website_secondary_cta_text: '',
  website_facilities_title: '',
  website_why_choose_title: '',
  website_gallery_title: '',
  website_contact_title: '',
  website_facilities: [],
  website_campus_media: [],
  website_whatsapp_number: '',
  website_show_whatsapp_button: true,
  website_show_social_ticker: true,
  website_show_notice_board: true,
  website_feature_images: [],
  website_articles: [],
  subscription_plan: 'premium',
  subscription_status: 'active',
  onboarded_at: '2026-01-15T00:00:00.000Z',
  admin_email: 'admin@school.com',
  admin_name: 'Admin User',
  total_students: 450,
  total_staff: 32,
}

export const useInstitutionStore = defineStore('institution', () => {
  const toast = useToastStore()
  const saved = loadFromStorage<InstitutionProfile>('institution_profile')
  const profile = ref<InstitutionProfile>({ ...defaultProfile, ...(saved || {}) })
  const loading = ref(false)

  watch(profile, (val) => saveToStorage('institution_profile', val), { deep: true })

  function updateProfile(data: Partial<InstitutionProfile>) {
    Object.assign(profile.value, data)
    toast.success('Institution profile updated')
  }

  function uploadLogo(base64Data: string) {
    profile.value.logo_url = base64Data
    toast.success('Logo uploaded successfully')
  }

  function uploadPrincipalPhoto(base64Data: string) {
    profile.value.principal_photo_url = base64Data
    toast.success('Principal photo updated')
  }

  function togglePublicWebsite() {
    profile.value.public_website_enabled = !profile.value.public_website_enabled
    toast.success(profile.value.public_website_enabled ? 'Public website enabled' : 'Public website disabled')
  }

  return {
    profile,
    loading,
    updateProfile,
    uploadLogo,
    uploadPrincipalPhoto,
    togglePublicWebsite,
  }
})
