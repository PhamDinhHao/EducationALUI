import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { HttpErrorCodeEnum } from "@/shared/core/enum/http-error-code.enum";
import { setFormError } from "@/shared/lib";

type HooksHandleForm = {
  onSubmit: (
    value: any,
    id?: number | string,
  ) => Promise<AxiosResponse<any, any>>;
  setError: any;
  id?: number | string;
  isValidForm: boolean;
  pathNavigate?: string;
  fnAfterSubmit?: () => void;
};

const useHandleForm = ({
  onSubmit,
  setError,
  id,
  isValidForm,
  pathNavigate,
  fnAfterSubmit,
}: HooksHandleForm) => {
  const navigate = useNavigate();

  const onSubmitForm = async (value: any) => {
    try {
      if (isValidForm) {
        await onSubmit(value, id);
        fnAfterSubmit && fnAfterSubmit()
        pathNavigate && navigate(pathNavigate, { replace: true });
      }
    } catch (err: any) {
      if (err.code === HttpErrorCodeEnum.UNPROCESSABLE_CONTENT) {
        const { errors = [] } = err;

        errors.length && setFormError(setError, errors);
      }
    }
  };

  return {
    onSubmitForm,
  };
};

export default useHandleForm;
