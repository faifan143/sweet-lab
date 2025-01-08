import { apiClient } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/types/types";

export interface User {
  id: number;
  username: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>("/users");
  return response;
};

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
