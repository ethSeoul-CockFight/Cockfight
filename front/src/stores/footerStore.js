import { create } from 'zustand'

const footerStore = create(set => ({
  activeMenu: 'main',
  setActiveMenu: (menu) => set({activeMenu: menu}),
}))

export default footerStore