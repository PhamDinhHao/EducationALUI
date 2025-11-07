import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const blogRoute = [
  {
    path: PagePath.BLOG,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.BLOG,
        element: lazyLoadModuleRoute(ModuleName.BLOG, PageName.BLOG)
      },
      {
        path: PagePath.BLOG_DETAIL,
        element: lazyLoadModuleRoute(ModuleName.BLOG, PageName.BLOG_DETAIL)
      },
      {
        path: PagePath.BLOG_ADD,
        element: lazyLoadModuleRoute(ModuleName.BLOG, PageName.BLOG_ADD)
      }
    ]
  }
]
