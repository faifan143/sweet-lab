import { useSelector } from "react-redux";
import { useEffect } from "react";
import { selectUser, selectAccessToken } from "@/redux/reducers/userSlice";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();

  useEffect(() => {
    if (!user || !accessToken) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, accessToken]);

  return { user, accessToken };
};
