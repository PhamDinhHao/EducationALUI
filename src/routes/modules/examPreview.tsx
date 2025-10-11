import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const examPreviewRoute = [
  {
    path: PagePath.EXAM_PREVIEW,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.EXAM_PREVIEW,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.EXAM_PREVIEW, PageName.EXAM_PREVIEW)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
