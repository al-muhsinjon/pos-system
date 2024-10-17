"use client";
import { useAuth } from "@/components/auth-prowider";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, FormProps, Input } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type FieldType = {
  roleId?: string;
  password?: string;
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated.valid) {
      router.push("/");
    }
  }, [isAuthenticated.valid, router]);

  const handleFromSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    const { password, roleId } = values;

    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleId, password }),
      });

      const data = await response.json();

      login(data.token);
      // setAccessToken(data.token);
      if (response.ok) {
        toast.success("Logged in successfully!");
      } else {
        toast.error(data.message || "Login failed!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Error logging in!");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex bg-[#ccc] justify-center items-center">
      <div className="p-8 bg-white max-w-md w-full shadow-2xl border rounded-md">
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl">Welcome!</h1>
          <p>Sign in to your account</p>
        </div>
        <Form
          name="basic"
          style={{
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          initialValues={{ remember: true }}
          onFinish={handleFromSubmit}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            layout="vertical"
            label="Role ID"
            required
            rules={[{ required: true, warningOnly: true, type: "string" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            name="roleId"
          >
            <Input
              suffix={<UserOutlined />}
              placeholder="UserID"
              size="middle"
              className="mb-4"
              required
              disabled={loading}
            />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            label="Password"
            name="password"
            required
            rules={[{ required: true, warningOnly: true, type: "string" }]}
          >
            <Input.Password
              placeholder="Password"
              size="middle"
              className="mb-4"
              disabled={loading}
              required
            />
          </Form.Item>
          <Button
            disabled={loading}
            type="primary"
            size="large"
            htmlType="submit"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
