// import { cn } from "@/lib/utils"
import { Button } from "@/view/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { Label } from "@/view/components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "@/utils/api";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      // Dapatkan ID token
      const token = await user.getIdToken();
      localStorage.setItem("fincoach_token", token);
      api.setToken(token); // Set token untuk API
      const res = await api.get("/users/profile");
      if (res) {
        navigate("/dashboard");
      } else {
        toast.error("Login gagal, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Login gagal:", error);
      if (error.code === "auth/user-not-found") {
        toast.error(
          "Pengguna tidak ditemukan. Silakan daftar terlebih dahulu."
        );
      } else if (error.code === "auth/wrong-password") {
        toast.error("Kata sandi salah. Silakan coba lagi.");
      } else {
        toast.error("Login gagal, silakan coba lagi.");
      }
    }
  };

  return (
    <div className='bg-purple-950'>
      <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm'>
          <div className={"flex flex-col gap-6"}>
            <Card className={"bg-purple-50 border-purple-50"}>
              <CardHeader>
                <CardTitle>Masuk ke Akunmu</CardTitle>
                <CardDescription>Masukan data dibawah ini</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className='flex flex-col gap-6'>
                    <div className='grid gap-3'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        aria-label='Email'
                        type='email'
                        placeholder='m@example.com'
                        value={formData.email}
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className='grid gap-3'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                        <a
                          href='#'
                          className='ml-auto text-purple-950 inline-block text-sm underline-offset-4 hover:underline'>
                          Lupa Password?
                        </a>
                      </div>
                      <Input
                        id='password'
                        aria-label='Password'
                        type='password'
                        placeholder='********'
                        value={formData.password}
                        onChange={e =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-3'>
                      <Button
                        type='submit'
                        className='w-full bg-purple-950 cursor-pointer'>
                        Login
                      </Button>
                    </div>
                  </div>
                  <div className='mt-4 text-center text-sm text-purple-950'>
                    Belum punya akun?{" "}
                    <Link
                      to='/register'
                      className='underline underline-offset-4'>
                      Daftar
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
