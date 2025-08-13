import { useCallback } from 'react'

import { useBoundStore } from '@/shared/stores'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getMenuParentKey } from '@/shared/utils'
import { PagePath } from '@/shared/core/enum/page.enum'
import { logout } from '@/shared/services/auth.service'

export const useMenu = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const resetProfile = useBoundStore((state) => state.resetProfile)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathParts = useMemo(() => pathname.split('/').slice(1), [pathname])

  useEffect(() => {
    const { openKeys: newOpenKeys, selectedKeys: newSelectedKeys } = getMenuParentKey(pathParts)
    setOpenKeys((prev) => (prev[0] === newOpenKeys ? prev : [newOpenKeys]))
    setSelectedKeys((prev) => (prev[0] === newSelectedKeys ? prev : [newSelectedKeys]))
  }, [pathParts])

  const onOpenChange = useCallback((keys: string[]) => {
    setOpenKeys(keys)
  }, [])

  const onMenuClick = useCallback(() => {
    setOpenKeys([])
    setMobileMenuOpen(false)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
    setOpenKeys([])
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    resetProfile()
    navigate(PagePath.LOGIN)
    closeMobileMenu()
  }, [resetProfile, navigate, closeMobileMenu])

  const handleLogin = useCallback(() => {
    navigate(PagePath.LOGIN)
  }, [navigate])

  return {
    openKeys,
    selectedKeys,
    mobileMenuOpen,
    onOpenChange,
    onMenuClick,
    toggleMobileMenu,
    closeMobileMenu,
    handleLogout,
    handleLogin
  }
}
