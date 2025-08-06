import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@/schemas/loginSchema";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { Link } from "react-router-dom";
import logo from "@/assets/ucalma-logo.webp";

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const email = watch("email");
  const password = watch("password");
  const isDisabled = !email || !password;

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data.email, data.password);
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Error desconocido");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-mental dark:bg-gray-800">
      <div className="max-w-sm w-full">
        <Link
          to="https://ingsoftware.ucuenca.edu.ec/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center mb-6"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-64 w-auto transition-transform duration-300 hover:scale-120 cursor-pointer"
          />
        </Link>

        {/* Mensaje de bienvenida */}
        <p className="text-center mb-6 text-gray-700 dark:text-gray-300 font-semibold">
          ¡Bienvenido!  Por favor inicia sesión para continuar.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
        >
          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
          <Input
            label="Correo"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Contraseña"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <SubmitButton label="Iniciar sesión" disabled={isDisabled} />
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-blue-500 hover:underline dark:text-blue-400">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>

    </div>
  );
}
