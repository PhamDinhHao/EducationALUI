import toast from "react-hot-toast";

type HttpMethod = "post" | "get" | "put" | "delete";

export const handleServerError = (method: HttpMethod, message: string) => {
  switch (method) {
    case "post":
      toast.error(message, { duration: 2000 });

      return;
    default:
      return;
  }
};

export const handleServerSuccess = (method: HttpMethod, message?: string) => {
  const messageLogin = window.location.pathname.includes("login")
    ? "Successfully logged in"
    : "";

  switch (method) {
    case "post":
      toast.success(messageLogin || message || "Successfully added.", { duration: 2000 });

      return;
    case "put":
      toast.success(message || "Successfully updated.", { duration: 2000 });

      return;
    case "delete":
      toast.success(message || "Successfully deleted.", { duration: 2000 });

      return;
    default:
      return;
  }
};
