import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProfileCard from '../../src/components/ProfileCard.vue'

describe('ProfileCard', () => {
  it('renders profile name using i18n key', () => {
    const wrapper = mount(ProfileCard, {
      global: {
        mocks: {
          $t: (msg) => msg,
          profile: {
             avatar: 'test.jpg',
             socials: []
          }
        }
      }
    })
    expect(wrapper.text()).toContain('profile.name')
  })
})
