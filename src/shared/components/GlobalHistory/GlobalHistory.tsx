import { router } from "@/routes";
import { NavigateFunction } from "react-router-dom";

export let globalNavigate:NavigateFunction;

export const GlobalHistory = () => {
  globalNavigate = router.navigate;

  return null;
};
