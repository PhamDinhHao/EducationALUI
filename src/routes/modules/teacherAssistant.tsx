import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const teacherAssistantRoute = [
  {
    path: PagePath.TEACHER_ASSISTANT,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.TEACHER_ASSISTANT,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.TEACHER_ASSISTANT, PageName.TEACHER_ASSISTANT)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
    