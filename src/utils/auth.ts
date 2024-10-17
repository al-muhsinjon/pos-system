"use client";
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "token";

export const setAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 7,
    path: "/",
    secure: true,
    sameSite: "strict",
  });
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
};
