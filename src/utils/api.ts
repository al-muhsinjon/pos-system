export const verifyToken = async (
  token: string
): Promise<{
  success: boolean;
  decoded?: {
    id: string;
    username: string;
    role: "Cashier" | "SuperAdmin";
    roleId: string;
  };
}> => {
  try {
    const response = await fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return {
      success: response.ok,
      decoded: data.data,
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return {
      success: false,
    };
  }
};
