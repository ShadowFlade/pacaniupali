import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomLink } from '@/Components/CustomLink';

export default function SidebarCustom({ loggedIn }) {
    return (
        <SidebarProvider className={'w-auto'}>
            <div className="flex h-screen w-auto">
                <Sidebar className="p-4 bg-sidebar">
                    <SidebarHeader className="p-4">
                        <h2 className="text-2xl font-bold">Своя игра</h2>
                    </SidebarHeader>

                    {
                        !loggedIn ? (<>
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
                            <div className="space-y-4 mt-16">
                                <div>
                                    <Label htmlFor="username">
                                        Имя пользователя
                                    </Label>
                                    <Input
                                        id="username"
                                        placeholder="Введите имя"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Пароль</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Введите пароль"
                                        autoComplete={''}
                                    />
                                </div>
                                <Button className="w-full">Войти</Button>
                                <div className="text-center">или</div>
                                <CustomLink variant="outline" className="w-full" href={'/register'}>
                                    Зарегистрироваться
                                </CustomLink>
                            </div>
                        </>) : null
                    }
                    {
                        // if in team ? last game : null (winner, your place, participants (show only avatars))
                    }
                    <SidebarContent className="">

                    </SidebarContent>
                </Sidebar>
                <main className="flex-1 overflow-hidden">
                    {/*<PhotoWall />*/}
                </main>
            </div>
        </SidebarProvider>
    );
}
