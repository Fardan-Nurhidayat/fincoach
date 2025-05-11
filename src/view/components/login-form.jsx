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

export function LoginForm({ className, ...props }) {
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
                <form>
                  <div className='flex flex-col gap-6'>
                    <div className='grid gap-3'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        aria-label='Email'
                        type='email'
                        placeholder='m@example.com'
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
                    <a
                      href='/register'
                      className='underline underline-offset-4'>
                      Daftar
                    </a>
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
