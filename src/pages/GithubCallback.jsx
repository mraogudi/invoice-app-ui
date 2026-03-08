import { useEffect, useRef } from "react"; // Added useRef
import { useSearchParams, useNavigate } from "react-router-dom";
import socialService from "../services/soacialService"; // Using your service
import { useSnackbar } from "notistack";

export default function GithubCallback() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const code = params.get("code");
  const { enqueueSnackbar } = useSnackbar();

  // Prevents double-execution in React Strict Mode (Development)
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (code && !hasCalledApi.current) {
      hasCalledApi.current = true;
      handleGithubLogin(code);
    }
  }, [params, nav, code]); // Added dependencies for best practice

  const handleGithubLogin = async (code) => {
    try {
      const response = await socialService.githubLogin({ code });

      if (response.status === 302) {
        enqueueSnackbar(
          <Typography
            sx={{
              fontFamily: "Monospace",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {response.data.message}
          </Typography>,
          { variant: "info" },
        );
      } else {
        enqueueSnackbar(
          <Typography
            sx={{
              fontFamily: "Monospace",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {response.data.message}
          </Typography>,
          { variant: "success" },
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        nav("/"); // Navigate after successful storage
      }
    } catch (error) {
      enqueueSnackbar(
        <Typography
          sx={{
            fontFamily: "Monospace",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          {error.response?.data?.message || "GitHub login failed"}
        </Typography>,
        { variant: "error" },
      );
      nav("/login"); // Send back to login on failure
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
    >
      Signing in with GitHub...
    </div>
  );
}
