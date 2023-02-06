import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import RegisterView from '../../views/RegisterView.vue'

describe('RegisterView', () => {
    it('renders properly', () => {
        const wrapper = mount(RegisterView, {})
        expect(wrapper.text()).toContain('提交注册')
    })
})
