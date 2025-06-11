import { CustomLink } from '@/Components/CustomLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarProvider,
} from '@/components/ui/sidebar';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function SidebarCustom({ loggedIn }) {
    const { post, data, setData, errors } = useForm({
        email: '',
        password: '',
    });

    const login: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: (e) => {console.log(e, ' FINISH', errors)},
            onSuccess:(e) => {console.log(e, ' SUCC', errors)}
        });
    };
    return (
        <SidebarProvider className={'w-auto'}>
            <div className="flex h-screen w-auto">
                <Sidebar className="bg-sidebar p-4">
                    <SidebarHeader className="p-4">
                        <h2 className="text-2xl font-bold">Своя игра</h2>
                    </SidebarHeader>

                    {!loggedIn ? (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="invite">
                                        Регистрация по приглашению
                                    </Label>
                                    <Input
                                        id="invite"
                                        placeholder="Введите код приглашения"
                                    />
                                    <Button className="mt-4 w-full bg-sidebar-accent-foreground">
                                        Принять приглашение
                                    </Button>
                                </div>
                            </div>
                            <form className="mt-16 space-y-4" onSubmit={login}>
                                <div>
                                    <Label htmlFor="login">
                                        Имя пользователя
                                    </Label>
                                    <Input
                                        id="email"
                                        placeholder="Введите имя"
                                        name='email'
                                        value={data.email}
                                        onChange={(e) => setData(
                                            'email',
                                            e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Пароль</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Введите пароль"
                                        autoComplete={''}
                                        name='password'
                                        value={data.password}
                                        onChange={(e) => setData(
                                            'password',
                                            e.target.value
                                        )}
                                    />
                                </div>
                                <Button type={'submit'} className="w-full">Войти</Button>
                                <div className="text-center">или</div>
                                <CustomLink
                                    variant="outline"
                                    className="w-full"
                                    href={'/register'}
                                >
                                    Зарегистрироваться
                                </CustomLink>
                            </form>
                        </>
                    ) : null}
                    {
                        // if in team ? last game : null (winner, your place, participants (show only avatars))
                    }
                    <SidebarContent className=""></SidebarContent>
                </Sidebar>
                <main className="flex-1 overflow-hidden">
                    {/*<PhotoWall />*/}
                </main>
            </div>
        </SidebarProvider>
    );
}
