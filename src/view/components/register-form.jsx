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
import { api } from "@/utils/api";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export function RegisterForm({ className, ...props }) {
  const navigate = useNavigate();

  const registerHandler = async e => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/register",
        {
          displayName: e.target.name.value,
          email: e.target.email.value,
          password: e.target.password.value,
      })

      console.log(response);
      if (response) {
        alert("Pendaftaran berhasil! Silakan masuk.");
        navigate("/login");
      } else {
        alert("Pendaftaran gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Gagal mendaftar. Silakan coba lagi.");
    }
  };

  return (
    <div className='bg-purple-950'>
      <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm'>
          <div className={"flex flex-col gap-6"}>
            <Card className={"bg-purple-50 border-purple-50"}>
              <CardHeader>
                <CardTitle>Daftar Akun</CardTitle>
                <CardDescription>Masukan data dibawah ini</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={registerHandler}
                  className='flex flex-col gap-6'>
                  <div className='flex flex-col gap-6'>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Nama</Label>
                      <Input
                        id='name'
                        name='name'
                        aria-label='Name'
                        type='text'
                        placeholder='John Doe'
                        required
                      />
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        name='email'
                        aria-label='Email'
                        type='email'
                        placeholder='m@example.com'
                        required
                      />
                    </div>
                    <div className='grid gap-3'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                      </div>
                      <Input
                        id='password'
                        name='password'
                        aria-label='Password'
                        type='password'
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-3'>
                      <Button
                        type='submit'
                        className='w-full bg-purple-950 cursor-pointer'>
                        Daftar
                      </Button>
                    </div>
                  </div>
                  <div className='text-center text-sm text-purple-950'>
                    Sudah punya akun?{" "}
                    <Link
                      to='/login'
                      aria-label='Masuk'
                      className='underline underline-offset-4'>
                      Masuk
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
